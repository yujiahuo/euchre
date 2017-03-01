//returns: [trumpSuit, alonePlayer, maker, bidRound]
class Bid {
	private __playerHands: Card[][]; //2d array of everyone's hands
	private __currentPlayer: Player;
	private __aiPlayers: (EuchreAI | null)[];
	private __bidStage: BidStage;
	private __playersBid: number = 0; //number of players who have bid so far
	private __trumpCandidateCard: Card; //turned up card
	private __bidResult: BidResult;

	/* Properties */
	public currentPlayer(): Player {
		return this.__currentPlayer;
	}

	public bidStage(): BidStage {
		return this.__bidStage;
	}

	public playersBid(): number {
		return this.__playersBid;
	}

	public trumpCandidateCard(): Card {
		return this.__trumpCandidateCard;
	}

	public bidResult(): BidResult {
		return this.__bidResult;
	}

	/* constructor */
	constructor(hands: Card[][], aiPlayers: (EuchreAI | null)[], firstPlayer: Player, trumpCandidateCard: Card) {
		this.__playerHands = hands;
		this.__aiPlayers = aiPlayers;
		this.__currentPlayer = firstPlayer;
		this.__bidStage = BidStage.BidRound1;
		this.__trumpCandidateCard = trumpCandidateCard;
		this.__bidResult = { success: false, trumpSuit: null, maker: null, alone: null, bidStage: null }
	}

	/* Public functions */

	//get a bid
	public advanceBid(hasBid: boolean, suit?: Suit, alone?: boolean): void {
		if (this.isFinished()) return;

		if (hasBid && suit !== undefined) {
			if (alone === undefined) alone = false;
			this.__bidResult = { success: true, trumpSuit: suit, maker: this.__currentPlayer, alone: alone, bidStage: this.__bidStage }
			this.__bidStage = BidStage.BidFinished;
			animShowText(this.__currentPlayer + " " + Suit[suit] + " " + alone, MessageLevel.Step, 1);
		}
		else {
			animShowText(this.__currentPlayer + " passed.", MessageLevel.Step, 1);
		}
		
		this.__playersBid++;
		this.__currentPlayer = nextPlayer(this.__currentPlayer);

		//everyone bid, round is over
		if (!hasBid && this.__playersBid >= 4) {
			if (this.__bidStage === BidStage.BidRound1) {
				this.__playersBid = 0;
				this.__bidStage = BidStage.BidRound2;
			}
			else {
				this.__bidStage = BidStage.BidFinished;
			}
		}
	}

	public isFinished(): boolean {
		if (this.__bidStage === BidStage.BidFinished) return true;
		else return false;
	}
}