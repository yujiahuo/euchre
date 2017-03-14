class Hand {
	//private __deck: Card[]; //contains the shuffled deck or what's left of it after dealing
	//private __hands: Card[][]; //2d array of everyone's hands
	private __trickNum: number; //what trick we're on
	private __gameStage: GameStage; //bidding round 1, bidding round 2, or trick playing
	private __playersBid: number; //number of players who have bid so far
	private __trumpCandidateCard: Card; //turned up card
	private __trumpSuit: Suit;	//current trump suit
	private __dealer: Player;
	private __maker: Player; //player who called trump
	private __alonePlayer: Player;
	private __numPlayers: number; //players playing this hand; this is usually 4 but can be 3 or 2 depending on loners
	private __nsTricksWon: number;
	private __ewTricksWon: number;

	/* Properties */
	public trickNum(): number {
		return this.__trickNum;
	}
	public gameStage(): GameStage {
		return this.__gameStage;
	}
	public playersBid(): number {
		return this.__playersBid;
	}
	public trumpCandidateCard(): Card {
		return this.__trumpCandidateCard;
	}
	public trumpSuit(): Suit {
		return this.__trumpSuit;
	}
	public dealer(): Player {
		return this.__dealer;
	}
	public maker(): Player {
		return this.__maker;
	}
	public alonePlayer(): Player {
		return this.__alonePlayer;
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
	constructor() {
		this.__gameStage = GameStage.BidRound1;
	}

	/* Private functions */

	/* Public functions */
}