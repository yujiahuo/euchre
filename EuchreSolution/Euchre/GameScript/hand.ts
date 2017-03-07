class Hand {
	//General stuff
	private __dealer: Player;
	private __deck: Card[]; //contains the shuffled deck or what's left of it after dealing
	private __playerHands: Card[][]; //2d array of everyone's hands
	private __aiPlayers: (EuchreAI | null)[];
	private __handStage: HandStage;

	//Bidding related
	private __bid: Bid;
	private __bidResult: BidResult | null;
	private __trumpCandidateCard: Card; //turned up card

	//Playing related
	private __trick: Trick;
	private __numTricksPlayed: number = 0;
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
	public playerHands(): Card[][] {
		return this.__playerHands;
	}
	public trumpCandidateCard(): Card | undefined {
		return this.__trumpCandidateCard;
	}
	public numTricksPlayed(): number {
		return this.__numTricksPlayed;
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
		this.initHand();
	}

	/* Private functions */

	private initHand(): void {
		//set up the deck and everyone's hands'
		this.__deck = getShuffledDeck();
		this.__playerHands = new Array(4);
		for (let i = 0; i < 4; i++) {
			this.__playerHands[i] = new Array(5);
		}
		dealHands(this.__deck, this.__playerHands, this.__dealer);
		this.__trumpCandidateCard = this.__deck.pop() as Card;

		//set up bidding
		this.__handStage = HandStage.Bidding;
		this.__bid = new Bid(this.__playerHands, this.__aiPlayers, nextPlayer(this.__dealer), this.__trumpCandidateCard);
	}

	private advanceHand(): void {
		switch (this.__handStage) {
			case HandStage.Bidding:
				this.__bidResult = this.__bid.doBidding();
				if (this.__bidResult !== null) {
					this.endBidding(this.__bidResult);
				}
				else {
					this.endHand(false);
				}
				break;
			case HandStage.Discard:
				this.discard();
				this.__handStage = HandStage.PlayTricks;
				if (this.__bidResult) {
					this.__trick = new Trick(this.__bidResult.trumpSuit as Suit, this.__bidResult.alone as boolean, this.__playerHands, this.__aiPlayers, nextPlayer(this.__dealer));
				}
				break;
			case HandStage.PlayTricks:
				let trickEnded = this.__trick.doTrick();
				if (trickEnded) {
					this.endTrick();
				}
				break;
		}
	}

	private endBidding(bidResult: BidResult): void {
		let rightID;
		let leftID;
		let trumpSuit = bidResult.trumpSuit as Suit;

		//This chunk is for changing the rank and suit of the right and left bowers
		//for the duration of the hand.
		//Note: The cards' IDs stay the same
		rightID = Suit[trumpSuit] + Rank.Jack;
		DECKDICT[rightID].rank = Rank.Right;
		leftID = Suit[getOppositeSuit(trumpSuit)] + Rank.Jack;
		DECKDICT[leftID].suit = trumpSuit;
		DECKDICT[leftID].rank = Rank.Left;

		if (bidResult.bidStage === BidStage.BidRound1) {
			this.addToHand(this.__dealer, this.__trumpCandidateCard);
			this.__handStage = HandStage.Discard;
		}
		else {
			this.__handStage = HandStage.PlayTricks;
			this.__trick = new Trick(bidResult.trumpSuit as Suit, bidResult.alone as boolean, this.__playerHands, this.__aiPlayers, nextPlayer(this.__dealer));
		}
	}

	private discard(): void {
		let aiPlayer = this.__aiPlayers[this.__dealer];
		let toDiscard: Card | null = null;

		if (aiPlayer !== null) {
			toDiscard = aiPlayer.pickDiscard();
		}
		if (!toDiscard) {
			toDiscard = this.__playerHands[this.__dealer][0];
		}

		this.removeFromHand(this.__dealer, toDiscard);
	}

	private endTrick(): void {
		if (this.__trick.winningTeam() === Team.NorthSouth) {
			this.__nsTricksWon++;
			animShowText("NS won this trick", MessageLevel.Step, 2);
		}
		else {
			this.__ewTricksWon++;
			animShowText("EW won this trick", MessageLevel.Step, 2);
		}
		this.__numTricksPlayed++;
		if (this.__numTricksPlayed >= 5){
			this.endHand(true);
		}
	}

	private endHand(completed: boolean): void {
		if (!completed) return; //TODO: deal with bid failing
		if (!this.__bidResult) return;

		let isMaker = (this.__bidResult.maker === Player.North || this.__bidResult.maker === Player.South)
		this.__nsPointsWon = calculatePointGain(this.__nsTricksWon, isMaker, this.__bidResult.alone);
		this.__ewPointsWon = calculatePointGain(this.__ewTricksWon, !isMaker, this.__bidResult.alone);

		this.resetJacks(this.__bidResult.trumpSuit);

		this.__handStage = HandStage.HandFinished;

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

	private resetJacks(trumpSuit: Suit): void {
		let rightID;
		let leftID;

		rightID = Suit[trumpSuit] + Rank.Jack;
		DECKDICT[rightID].rank = Rank.Jack;
		leftID = Suit[getOppositeSuit(trumpSuit)] + Rank.Jack;
		DECKDICT[leftID].suit = getOppositeSuit(trumpSuit);
		DECKDICT[leftID].rank = Rank.Jack;
	}

	/* Public functions */
	public doHand(): void {
		while (!this.isFinished()) {
			this.advanceHand();
		}
		return;
	}

	public isFinished(): boolean {
		if (this.__handStage === HandStage.HandFinished) return true;
		else return false;
	}
}