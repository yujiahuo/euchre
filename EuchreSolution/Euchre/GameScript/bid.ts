enum BidStage {
	Round1,
	Round2,
	Finished,
}

interface BidResult {
	trump: Suit;
	maker: Player;
	alone: boolean;
	stage: BidStage;
}

class Bid {
	private __playerHands: Card[][]; //2d array of everyone's hands
	private __dealer: Player;
	private __currentPlayer: Player;
	private __aiPlayers: (EuchreAI | null)[];
	private __stage: BidStage;
	private __playersBid: number = 0; //number of players who have bid so far
	private __trumpCandidate: Card; //turned up card
	private __bidResult: BidResult | null = null;

	/* Properties */
	public currentPlayer(): Player {
		return this.__currentPlayer;
	}

	public stage(): BidStage {
		return this.__stage;
	}

	public playersBid(): number {
		return this.__playersBid;
	}

	public bidResult(): BidResult | null {
		return this.__bidResult;
	}

	/* constructor */
	constructor(hands: Card[][], aiPlayers: (EuchreAI | null)[], dealer: Player, trumpCandidate: Card) {
		this.__playerHands = hands;
		this.__aiPlayers = aiPlayers;
		this.__dealer = dealer;
		this.__currentPlayer = nextPlayer(dealer);
		this.__stage = BidStage.Round1;
		this.__trumpCandidate = trumpCandidate;
	}

	private advanceBid(): void {
		let aiPlayer: EuchreAI | null = this.__aiPlayers[this.__currentPlayer];
		let bidSuccessful = false;
		let bidResult: BidResult | null = null;

		if (aiPlayer) {
			bidResult = this.getAIBid(this.__currentPlayer, aiPlayer, this.__stage, this.__trumpCandidate);
		}

		if (bidResult) {
			if (bidResult.stage === BidStage.Round2 && bidResult.trump === this.__trumpCandidate.suit) {
				bidResult = null;
			} else if (!hasSuit(this.__playerHands[this.__currentPlayer], bidResult.trump)) {
				bidResult = null;
			}
		}

		if (bidResult) {
			bidSuccessful = true;
			this.__bidResult = bidResult;
			this.__stage = BidStage.Finished;
			animShowText(this.__currentPlayer + " " + Suit[bidResult.trump] + " " + bidResult.alone, MessageLevel.Step, 1);
		}
		else {
			animShowText(this.__currentPlayer + " passed.", MessageLevel.Step, 1);
		}

		this.__playersBid++;
		this.__currentPlayer = nextPlayer(this.__currentPlayer);

		//everyone bid, round is over
		if (!bidSuccessful && this.__playersBid >= 4) {
			if (this.__stage === BidStage.Round1) {
				this.__playersBid = 0;
				this.__stage = BidStage.Round2;
			}
			else {
				this.__stage = BidStage.Finished;
			}
		}
	}

	private getAIBid(currentPlayer: Player, aiPlayer: EuchreAI, stage: BidStage, trumpCandidate: Card): BidResult | null {
		let trump: Suit | null = null;

		if (stage === BidStage.Round1) {
			if (aiPlayer.chooseOrderUp(this.__playerHands[currentPlayer], trumpCandidate, this.__dealer)) {
				trump = trumpCandidate.suit;
			}
		}
		else if (stage === BidStage.Round2) {
			trump = aiPlayer.pickTrump(this.__playerHands[currentPlayer], trumpCandidate);
		}

		if (trump === null) {
			return null;
		}

		return {
			trump: trump,
			maker: currentPlayer,
			alone: aiPlayer.chooseGoAlone(this.__playerHands[currentPlayer], trump),
			stage: stage,
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
		return this.__stage === BidStage.Finished;
	}
}
