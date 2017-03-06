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
		this.__bidResult = { trumpSuit: null, maker: null, alone: null, bidStage: null }
	}

	private advanceBid(): void {
		let aiPlayer: EuchreAI | null = this.__aiPlayers[this.__currentPlayer];
		let bidSuccessful: boolean = false;
		let bidResult: BidResult = {
			trumpSuit: null, maker: null, alone: null, bidStage: null
		};

		if (this.isFinished()) return;

		if (aiPlayer) {
			bidResult = getAIBid(this.__currentPlayer, aiPlayer, this.__bidStage, this.__trumpCandidateCard);
		}

		if (bidResult.trumpSuit !== null) {
			bidSuccessful = true;
			this.__bidResult = bidResult;
			this.__bidStage = BidStage.BidFinished;
			animShowText(this.__currentPlayer + " " + Suit[bidResult.trumpSuit] + " " + bidResult.alone, MessageLevel.Step, 1);
		}
		else {
			animShowText(this.__currentPlayer + " passed.", MessageLevel.Step, 1);
		}

		this.__playersBid++;
		this.__currentPlayer = nextPlayer(this.__currentPlayer);

		//everyone bid, round is over
		if (!bidSuccessful && this.__playersBid >= 4) {
			if (this.__bidStage === BidStage.BidRound1) {
				this.__playersBid = 0;
				this.__bidStage = BidStage.BidRound2;
			}
			else {
				this.__bidStage = BidStage.BidFinished;
			}
		}
	}

	/* Public functions */
	public doBidding(): BidResult {
		while (!this.isFinished()) {
			this.advanceBid();
		}
		return this.__bidResult;
	}

	public isFinished(): boolean {
		if (this.__bidStage === BidStage.BidFinished) return true;
		else return false;
	}
}