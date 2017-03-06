class Hand {
	//General stuff
	private __dealer: Player;
	private __deck: Card[]; //contains the shuffled deck or what's left of it after dealing
	private __playerHands: Card[][]; //2d array of everyone's hands
	private __aiPlayers: (EuchreAI | null)[];
	private __handStage: HandStage;

	//Bidding related
	private __bid: Bid;
	private __trumpCandidateCard: Card; //turned up card
	private __trumpSuit: Suit;	//current trump suit
	private __maker: Player; //player who called trump
	private __alone: boolean;

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
	public playerHands(): Card[][] {
		return this.__playerHands;
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
	public alone(): boolean {
		return this.__alone;
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

	private endBidding(bid: Bid): void {
		let bidResult: BidResult;
		let rightID;
		let leftID;

		if (!bid.isFinished()) return;
		bidResult = bid.bidResult();
		this.__trumpSuit = bidResult.trumpSuit as Suit;
		this.__maker = bidResult.maker as Player;
		this.__alone = bidResult.alone as boolean;

		//This chunk is for changing the rank and suit of the right and left bowers
		//for the duration of the hand.
		//Note: The cards' IDs stay the same
		rightID = Suit[this.__trumpSuit] + Rank.Jack;
		DECKDICT[rightID].rank = Rank.Right;
		leftID = Suit[getOppositeSuit(this.__trumpSuit)] + Rank.Jack;
		DECKDICT[leftID].suit = this.__trumpSuit;
		DECKDICT[leftID].rank = Rank.Left;
	}

	/* Public functions */


}