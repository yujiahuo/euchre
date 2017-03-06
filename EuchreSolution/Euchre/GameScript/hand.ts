class Hand {
	//General stuff
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
		this.initHand();
	}

	/* Private functions */

	//Shuffle the deck and deal it out. Flip up trump candidate
	private initHand(): void {
		this.__deck = getShuffledDeck();
		this.__playerHands = new Array(4);
		for (let i = 0; i < 4; i++) {
			this.__playerHands[i] = new Array(5);
		}

		dealHands(this.__deck, this.__playerHands, this.__dealer);
		this.__trumpCandidateCard = this.__deck.pop();
	}

	/* Public functions */
}