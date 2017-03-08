//returns: [trumpSuit, alonePlayer, maker, bidRound]
class Bid {
	private __playerHands: Card[][]; //2d array of everyone's hands
	private __currentPlayer: Player;
	private __aiPlayers: (EuchreAI | null)[];
	private __bidStage: BidStage;
	private __playersBid: number = 0; //number of players who have bid so far
	private __trumpCandidateCard: Card; //turned up card
	private __bidResult: BidResult | null = null;

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

	public bidResult(): BidResult | null {
		return this.__bidResult;
	}

	/* constructor */
	constructor(hands: Card[][], aiPlayers: (EuchreAI | null)[], firstPlayer: Player, trumpCandidateCard: Card) {
		this.__playerHands = hands;
		this.__aiPlayers = aiPlayers;
		this.__currentPlayer = firstPlayer;
		this.__bidStage = BidStage.Round1;
		this.__trumpCandidateCard = trumpCandidateCard;
	}

	private advanceBid(): void {
		let aiPlayer: EuchreAI | null = this.__aiPlayers[this.__currentPlayer];
		let bidSuccessful = false;
		let bidResult: BidResult | null = null;

		if (aiPlayer) {
			bidResult = getAIBid(this.__currentPlayer, aiPlayer, this.__bidStage, this.__trumpCandidateCard);
		}

		if (bidResult) {
			if (bidResult.bidStage === BidStage.Round2 && bidResult.trumpSuit === this.__trumpCandidateCard.suit) {
				bidResult = null;
			} else if (!hasSuit(this.__playerHands[this.__currentPlayer], bidResult.trumpSuit)) {
				bidResult = null;
			}
		}

		if (bidResult) {
			bidSuccessful = true;
			this.__bidResult = bidResult;
			this.__bidStage = BidStage.Finished;
			animShowText(this.__currentPlayer + " " + Suit[bidResult.trumpSuit] + " " + bidResult.alone, MessageLevel.Step, 1);
		}
		else {
			animShowText(this.__currentPlayer + " passed.", MessageLevel.Step, 1);
		}

		this.__playersBid++;
		this.__currentPlayer = nextPlayer(this.__currentPlayer);

		//everyone bid, round is over
		if (!bidSuccessful && this.__playersBid >= 4) {
			if (this.__bidStage === BidStage.Round1) {
				this.__playersBid = 0;
				this.__bidStage = BidStage.Round2;
			}
			else {
				this.__bidStage = BidStage.Finished;
			}
		}
	}

	/* Public functions */
	public doBidding(): BidResult | null {
		while (!this.isFinished()) {
			this.advanceBid();
		}
		return this.__bidResult;
	}

	public isFinished(): boolean {
		return this.__bidStage === BidStage.Finished;
	}
}
