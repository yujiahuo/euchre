class Hand {
	//General stuff
	private __handStage: HandStage; //bidding round 1, bidding round 2, or trick playing
	private __dealer: Player;
	private __deck: Card[]; //contains the shuffled deck or what's left of it after dealing
	private __playerHands: Card[][]; //2d array of everyone's hands
	private __aiPlayers: (EuchreAI | null)[];

	//Bidding related
	private __trumpCandidateCard: Card | undefined; //turned up card
	private __trumpSuit: Suit;	//current trump suit
	private __maker: Player; //player who called trump
	private __alonePlayer: Player;

	//Playing related
	private __trick: Trick;
	private __trickNum: number = 0; //what trick we're on
	private __numPlayers: number = 0; //players playing this hand; this is usually 4 but can be 3 or 2 depending on loners
	private __nsTricksWon: number= 0;
	private __ewTricksWon: number = 0;
	private __nsPointsWon: number = 0;
	private __ewPointsWon: number = 0;

	/* Properties */
	public handStage(): HandStage {
		return this.__handStage;
	}
	public dealer(): Player {
		return this.__dealer;
	}
	public playerHand(player: Player): Card[] {
		let hand: Card[] = [];
		let card;

		for (let i = 0; i < this.__playerHands[player].length; i++) {
			card = this.__playerHands[player][i];
			hand[i] = new Card(card);
		}
		return hand;
	}
	public trumpCandidateCard(): Card | undefined {
		return this.__trumpCandidateCard;
	}
	public trumpSuit(): Suit {
		return this.__trumpSuit;
	}
	public maker(): Player {
		return this.__maker;
	}
	public alonePlayer(): Player {
		return this.__alonePlayer;
	}
	public trickNum(): number {
		return this.__trickNum;
	}
	public numPlayers(): number {
		return this.__numPlayers;
	}
	public nsTricksWon(): number {
		return this.__nsTricksWon;
	}
	public ewTricksWon(): number {
		return this.__ewTricksWon;
	}

	/* constructor */
	constructor(dealer: Player, aiPlayers: (EuchreAI | null)[]) {
		this.__dealer = dealer;
		this.__aiPlayers = aiPlayers;
		this.__handStage = HandStage.BidRound1;
		this.initHand(dealer);
	}

	/* Private functions */
	private initHand(dealer: Player): void {

		this.__dealer = dealer;
		animPlaceDealerButt();

		this.__deck = getShuffledDeck();
		this.__playerHands = new Array(4);
		for (let i = 0; i < 4; i++) {
			this.__playerHands[i] = new Array(5);
		}

		this.__currentPlayer = nextPlayer(this.__dealer);

		dealHands(this.__deck, this.__playerHands, this.__dealer);
		this.__trumpCandidateCard = this.__deck.pop();
		animDeal(this.__playerHands);

		//let AIs initialize
		for (let i = 0; i < 4; i++) {
			this.__currentPlayer = i;
			let aiPlayer = this.__aiPlayers[i];
			if (aiPlayer !== null) {
				aiPlayer.init();
			}
		}

		this.__currentPlayer = nextPlayer(this.__dealer);
		this.__handStage = HandStage.BidRound1;
	}


	//sets trumpSuit, left/right nonsense, maker, and alone player
	private setTrump(suit: Suit, player: Player, alone: boolean): void {
		let rightID;
		let leftID;

		this.__trumpSuit = suit;

		//This chunk is for changing the rank and suit of the right and left bowers
		//for the duration of the hand.
		//Note: The cards' IDs stay the same
		rightID = Suit[this.__trumpSuit] + Rank.Jack;
		DECKDICT[rightID].rank = Rank.Right;
		leftID = Suit[getOppositeSuit(this.__trumpSuit)] + Rank.Jack;
		DECKDICT[leftID].suit = this.__trumpSuit;
		DECKDICT[leftID].rank = Rank.Left;

		this.__maker = player;
		if (alone) {
			this.__alonePlayer = player;
		}
	}

	private discardCard(toDiscard: Card | null): void {
		let card: Card;

		if (!toDiscard || !isInHand(this.__hands[this.__dealer], toDiscard)) {
			card = this.__hands[this.__dealer][0];
		}
		else {
			card = toDiscard;
		}
		this.removeFromHand(this.__dealer, card);

		animShowText(Player[this.__currentPlayer] + " discarded " + card.id, MessageLevel.Step, 1);
		this.startTricks();
	}
	private startTricks(): void {
		this.__handStage = HandStage.PlayTricks;
		this.__trick = new Trick(this.__trumpSuit as Suit, (this.__alonePlayer !== undefined), this.__hands, this.__aiPlayers, nextPlayer(this.__dealer));
	}

	private addToHand(player: Player, card: Card): void {
		this.__playerHands[player].push(card);
	}

	//finds index of given ID inefficiently
	//splice removes 1 at a given index
	//fails silently if card isn't found, which should never happen
	private removeFromHand(player: Player, card: Card): void {
		let cardID = card.id;

		for (let i = 0; i < this.__playerHands[player].length; i++) {
			if (this.__playerHands[player][i].id === cardID) {
				this.__playerHands[player].splice(i, 1);
			}
		}
	}

	private endTrick(): void {
		for (let i = 0; i < 4; i++) {
			let aiPlayer = this.__aiPlayers[i];
			if (aiPlayer !== null) {
				aiPlayer.trickEnd();
			}
		}
		this.scoreTrick();
		if (this.__trickNum >= 4) {
			this.endHand();
		}
		else {
			this.__currentPlayer = this.__trick.winner() as Player;
			this.__trick = new Trick(this.__trumpSuit as Suit, (this.__alonePlayer !== undefined), this.__hands, this.__aiPlayers, this.__currentPlayer);
			this.__trickNum++;
		}
	}

	private scoreTrick(): void {
		if (this.__trick.winningTeam() === Team.NorthSouth) {
			this.__nsTricksWon++;
			animShowText("NS won this trick", MessageLevel.Step, 2);
		}
		else {
			this.__ewTricksWon++;
			animShowText("EW won this trick", MessageLevel.Step, 2);
		}
	}

	private calcPoints(): void {
		let isMaker;
		let alone = (this.__alonePlayer !== undefined);

		if (this.__nsTricksWon > this.__ewTricksWon) {
			isMaker = (this.__maker === Player.North || this.__maker === Player.South);
			this.__nsPointsWon += calculatePointGain(this.__nsTricksWon, isMaker, alone);
		}
		else {
			isMaker = (this.__maker === Player.East || this.__maker === Player.West);
			this.__ewPointsWon += calculatePointGain(this.__ewTricksWon, isMaker, alone);
		}

		//TODO: deal with this
		//animShowText("Score: " + this.__nsPointsWon + " : " + this.__ewPointsWon, MessageLevel.Step);
	}

	private resetJacks(trumpSuit: Suit): void {
		let rightID;
		let leftID;

		rightID = Suit[trumpSuit] + Rank.Jack;
		DECKDICT[rightID].rank = Rank.Jack;
		leftID = Suit[getOppositeSuit(trumpSuit)] + Rank.Jack;
		DECKDICT[leftID].suit = getOppositeSuit(trumpSuit);
		DECKDICT[leftID].rank = Rank.Jack;
	}

	private endHand(): void {
		this.resetJacks(this.__trumpSuit as Suit);
		this.calcPoints();
		this.__handStage = HandStage.HandFinished;
	}
	/* Public functions */
}