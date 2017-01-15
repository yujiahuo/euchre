/*****************************************************************************
 * Game object
 *****************************************************************************/

class Game {
	//#region Private variables

	//game
	private __currentPlayer: Player;
	private __nsScore: number; //north south
	private __ewScore: number; //east west

	//hand
	private __deck: Card[]; //contains the shuffled deck or what's left of it after dealing
	private __gameStage: GameStage; //bidding round 1, bidding round 2, or trick playing
	private __playersBid: number; //number of players who have bid so far
	private __hands: Card[][]; //2d array of everyone's hands
	private __trumpCandidateCard: Card; //turned up card
	private __trumpSuit: Suit;	//current trump suit
	private __dealer: Player;
	private __maker: Player; //player who called trump
	private __alonePlayer: Player;
	private __numPlayers: number; //players playing this hand; this is usually 4 but can be 3 or 2 depending on loners
	private __nsTricksWon: number;
	private __ewTricksWon: number;

	//trick
	private __trickNum: number; //what trick we're on
	private __trickPlayersPlayed: number; //how many players have played this trick
	private __trickSuitLead: Suit; //the suit that was lead
	private __trickPlayedCards: PlayedCard[]; //array of cards that have been played this trick so far

	//settings
	private __sound: boolean;
	private __openHands: boolean;
	private __defendAlone: boolean;
	private __noTrump: boolean;
	private __showTrickHistory: boolean;
	private __statMode: boolean;
	private __aiPlayers: EuchreAI[];
	private __hasHooman: boolean; //if there is a human player
	//#endregion

	public logText = "";

	//#region Get functions
	public getGameStage(): GameStage {
		return this.__gameStage;
	}
	public getPlayersBid(): number {
		return this.__playersBid;
	}
	public getNsScore(): number {
		return this.__nsScore;
	}
	public getEwScore(): number {
		return this.__ewScore;
	}
	public getTrumpCandidateCard(): Card {
		return new Card(this.__trumpCandidateCard.suit, this.__trumpCandidateCard.rank);
	}
	public getTrumpSuit(): Suit {
		return this.__trumpSuit;
	}
	public getDealer(): Player {
		return this.__dealer;
	}
	public getMaker(): Player {
		return this.__maker;
	}
	public getAlonePlayer(): Player {
		return this.__alonePlayer;
	}
	public getNumPlayers(): number {
		return this.__numPlayers;
	}
	public getTrickNum(): number {
		return this.__trickNum;
	}
	public getTrickPlayersPlayed(): number {
		return this.__trickPlayersPlayed;
	}
	public getTrickSuit(): Suit {
		return this.__trickSuitLead;
	}
	public getTrickPlayedCards(): PlayedCard[] {
		let playedCards: PlayedCard[] = [];
		let card: Card;
		let cardCopy: Card;

		for (let i = 0; i < this.__trickPlayedCards.length; i++) {
			card = this.__trickPlayedCards[i].card;

			//make deep copy of cards
			cardCopy = new Card(card.suit, card.rank);
			playedCards.push({ player: this.__trickPlayedCards[i].player, card: cardCopy });
		}
		return playedCards;
	}
	public getCurrentPlayer(): Player {
		return this.__currentPlayer;
	}
	public getNsTricksWon(): number {
		return this.__nsTricksWon;
	}
	public getEwTricksWon(): number {
		return this.__ewTricksWon;
	}
	public isOpenHands(): boolean {
		return this.__openHands;
	}
	public isStatMode(): boolean {
		return this.__statMode;
	}
	public getAIPlayer(player: Player): EuchreAI {
		return (this.__aiPlayers[player]);
	}
	public myHand(): Card[] {
		let hand = [];
		let card;

		for (let i = 0; i < this.__hands[this.__currentPlayer].length; i++) {
			card = this.__hands[this.__currentPlayer][i];
			hand[i] = new Card(card.suit, card.rank, card.id);
		}

		return hand;
	}

	//#endregion

	/*******************************
	 * Private functions
	 ********************************/

	private startNewGame(): void {
		this.grabSettings();
		animShowText("STAGE: start");
		this.initGame();
		this.doStep();
	}

	//TODO: implement these!
	private letHumanBid(param: any): void { }
	private letHumanClickCards(): void { }

	private doStep(): void {
		animShowText("STAGE: " + GameStage[this.__gameStage]);
		switch (this.__gameStage) {
			case GameStage.NewHand:
				this.initHand();
				break;
			case GameStage.BidRound1:
				if (!this.__aiPlayers[this.__currentPlayer]) {
					this.letHumanBid(1);
					return;
				}
				this.handleBid();
				break;
			case GameStage.BidRound2:
				if (!this.__aiPlayers[this.__currentPlayer]) {
					this.letHumanBid(2);
					return;
				}
				this.handleBid();
				break;
			case GameStage.Discard:
				if (!this.__aiPlayers[this.__dealer]) {
					this.letHumanClickCards();
					return;
				}
				this.discardCard(this.__aiPlayers[this.__dealer].pickDiscard());
				break;
			case GameStage.PlayTricks:
				if (!this.__aiPlayers[this.__currentPlayer]) {
					this.letHumanClickCards();
					return;
				}
				this.playTrickStep();
				break;
			default:
				return;
		}
		this.doStep();
	}

	//#region Setup
	private grabSettings(): void {
		//checkbox settings
		this.__sound = (document.getElementById("chkSound") as HTMLInputElement).checked;
		this.__openHands = true //(document.getElementById("chkOpenHands") as HTMLInputElement).checked;
		this.__defendAlone = (document.getElementById("chkDefendAlone") as HTMLInputElement).checked;
		this.__noTrump = (document.getElementById("chkNoTrump") as HTMLInputElement).checked;
		this.__showTrickHistory = (document.getElementById("chkShowHistory") as HTMLInputElement).checked;

		//ai settings
		this.__statMode = true //(document.getElementById("chkStatMode") as HTMLInputElement).checked; //4 AIs play against each other
		this.__aiPlayers = [new DecentAI(), new DecentAI(), new DecentAI(), new DecentAI()];
		this.__hasHooman = this.__aiPlayers.indexOf(null) > -1;
	}

	//just sets scores to 0
	private initGame(): void {
		this.__nsScore = 0;
		this.__ewScore = 0;
		this.__gameStage = GameStage.NewHand;
	}

	//resets variables, gets dealer, shuffles deck, inits empty hands, sets currentplayer to left of dealer
	private initHand(): void {
		this.__playersBid = 0;
		this.__trumpCandidateCard = null;
		this.__trumpSuit = null;
		this.__maker = null;
		this.__alonePlayer = null;
		this.__numPlayers = 0;
		this.__nsTricksWon = 0;
		this.__ewTricksWon = 0;
		this.__trickNum = 0;

		this.__dealer = getDealer();
		animPlaceDealerButt()

		this.__deck = getShuffledDeck();
		this.__hands = new Array(4);
		for (let i = 0; i < 4; i++) {
			this.__hands[i] = new Array(5);
		}

		this.__currentPlayer = nextPlayer(this.__dealer);

		dealHands(this.__deck, this.__hands, this.__dealer);
		this.__trumpCandidateCard = this.__deck.pop();
		animDeal(this.__hands);

		//let AIs initialize
		for (let i = 0; i < 4; i++) {
			this.__currentPlayer = i;
			if (this.__aiPlayers[i] !== null) {
				this.__aiPlayers[i].init();
			}
		}

		this.__currentPlayer = nextPlayer(this.__dealer);
		this.__gameStage = GameStage.BidRound1;
	}

	//called at the beginning of each trick
	private initTrick(): void {
		this.__trickPlayersPlayed = 0;
		this.__trickSuitLead = null;
		this.__trickPlayedCards = [];
	}
	//#endregion

	//get a bid
	private handleBid(): void {
		let suit;
		let alone;
		let discard;
		let aiPlayer = this.__aiPlayers[this.__currentPlayer];

		//see if AI bids
		suit = getAIBid(aiPlayer, this.__gameStage);
		if (suit !== null) {
			alone = aiPlayer.chooseGoAlone();
			this.endBidding(suit, alone);
			return;
		}
		animShowText(this.__currentPlayer + " passed.", 1);
		this.advanceBidding();
	}

	private advanceBidding(): void {
		this.__playersBid++;
		this.__currentPlayer = nextPlayer(this.__currentPlayer);

		//everyone bid, round is over
		if (this.__playersBid >= 4) {
			if (this.__gameStage === GameStage.BidRound1) {
				this.__playersBid = 0;
				this.__gameStage = GameStage.BidRound2;
			}
			else {
				this.__gameStage = GameStage.NewHand;
			}
		}
	}

	private endBidding(suit: Suit, alone: boolean): void {
		animShowText(this.__currentPlayer + " " + Suit[suit] + " " + alone, 1);
		this.setTrump(suit, this.__currentPlayer, alone);
		//if round 1, dealer also needs to discard
		if (this.__gameStage === GameStage.BidRound1) {
			this.__gameStage = GameStage.Discard;
		}
		else {
			this.startTricks();
		}
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

	private discardCard(toDiscard: Card): void {
		animShowText(Player[this.__currentPlayer] + " discarded " + toDiscard.id, 1);
		this.removeFromHand(this.__dealer, toDiscard);
		this.__hands[this.__dealer].push(this.__trumpCandidateCard);

		this.startTricks();
	}

	private startTricks(): void {
		this.__gameStage = GameStage.PlayTricks;
		this.initTrick();
	}

	private playTrickStep(): void {
		let card: Card;
		let hand: Card[] = this.__hands[this.__currentPlayer];

		card = this.__aiPlayers[this.__currentPlayer].pickCard();

		if (!isValidPlay(hand, card, this.__trickSuitLead)) {
			card = getFirstLegalCard(hand);
		}
		this.playCard(this.__currentPlayer, card);

		this.advanceTrick();
	}

	private advanceTrick(): void {
		this.__trickPlayersPlayed++;
		this.__currentPlayer = nextPlayer(this.__currentPlayer);

		//everyone played, end trick
		if (this.__trickPlayersPlayed >= 4) {
			this.endTrick();
		}
	}

	private endTrick(): void {
		for (let i = 0; i < 4; i++) {
			if (this.__aiPlayers[i] !== null) {
				this.__aiPlayers[i].trickEnd();
			}
		}
		let trickWinner = getBestCardPlayed(this.__trickPlayedCards, this.__trumpSuit).player;
		this.scoreTrick(trickWinner);
		if (this.__trickNum >= 4) {
			this.endHand();
		}
		else {
			this.initTrick();
			this.__currentPlayer = trickWinner;
			this.__trickNum++;
		}
	}

	private playCard(player: Player, card: Card): void {
		this.removeFromHand(player, card);
		this.__trickPlayedCards.push({ player: player, card: card });
		animShowText(Player[player] + " played " + card.id, 1);
		//play card, store played card, iterate num players played
		//check if hand ended, then check if game ended
	}
	private scoreTrick(trickWinner: Player): void {
		if (trickWinner === Player.North || trickWinner === Player.South) {
			this.__nsTricksWon++;
			animShowText("NS won this trick", 2);
		}
		else {
			this.__ewTricksWon++;
			animShowText("EW won this trick", 2);
		}
	}

	private endHand(): void {
		this.resetJacks();
		this.updateScore();
		if (this.__nsScore >= 10 || this.__ewScore >= 10) {
			this.endGame();
		}
		else {
			this.__gameStage = GameStage.NewHand;
		}
	}

	private resetJacks(): void {
		let rightID;
		let leftID;

		rightID = Suit[this.__trumpSuit] + Rank.Jack;
		DECKDICT[rightID].rank = Rank.Jack;
		leftID = Suit[getOppositeSuit(this.__trumpSuit)] + Rank.Jack;
		DECKDICT[leftID].suit = getOppositeSuit(this.__trumpSuit);
		DECKDICT[leftID].rank = Rank.Jack;
	}

	private updateScore(): void {
		let isMaker;
		let alone = (this.__alonePlayer !== null);

		if (this.__nsTricksWon > this.__ewTricksWon) {
			isMaker = (this.__maker === Player.North || this.__maker === Player.South);
			this.__nsScore += calculatePointGain(this.__nsTricksWon, isMaker, alone);
		}

		else {
			isMaker = (this.__maker === Player.East || this.__maker === Player.West);
			this.__ewScore += calculatePointGain(this.__ewTricksWon, isMaker, alone);
		}

		animShowText("Score: " + this.__nsScore + " : " + this.__ewScore);
	}

	private endGame(): void {
		animShowText("Final score: " + this.__nsScore + " : " + this.__ewScore);
		this.__gameStage = null;
		if (this.isStatMode()) {
			updateLog(this.logText, true);
		}
	}

	private addToHand(player: Player, card: Card): void {
		this.__hands[player].push(card);
	}

	//finds index of given ID inefficiently
	//splice removes 1 at a given index
	//fails silently if card isn't found, which should never happen
	private removeFromHand(player: Player, card: Card): void {
		let cardID = card.id;

		for (let i = 0; i < this.__hands[player].length; i++) {
			if (this.__hands[player][i].id === cardID) {
				this.__hands[player].splice(i, 1);
			}
		}
	}


	/*******************************
	 * Public functions
	 ********************************/

	public start(): void {
		this.startNewGame();
	}
}
