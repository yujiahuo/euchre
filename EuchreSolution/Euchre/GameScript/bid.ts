enum BidStage {
	Round1,
	Discard,
	Round2,
	Finished,
}

interface BidResult {
	stage: BidStage.Round1 | BidStage.Round2;
	trump: Suit;
	maker: Player;
	alone: boolean;
}

class Bid {
	private __playerHands: Card[][]; //2d array of everyone's hands
	private __jacks: Card[];
	private __dealer: Player;
	private __currentPlayer: Player;
	private __aiPlayers: (EuchreAI | null)[];
	private __stage: BidStage;
	private __playersBid: number = 0; //number of players who have bid so far
	private __trumpCandidate: Card; //turned up card
	private __bidResult: BidResult | null = null;

	/* constructor */
	constructor(hands: Card[][], jacks: Card[], aiPlayers: (EuchreAI | null)[],
		dealer: Player, trumpCandidate: Card) {
		this.__playerHands = hands;
		this.__jacks = jacks;
		this.__aiPlayers = aiPlayers;
		this.__dealer = dealer;
		this.__currentPlayer = nextPlayer(dealer);
		this.__stage = BidStage.Round1;
		this.__trumpCandidate = trumpCandidate;
	}

	private advanceBid(): void {
		switch (this.__stage) {
			case BidStage.Round1:
			case BidStage.Round2:
				this.__bidResult = this.doBid(this.__stage);
				const player = this.__currentPlayer;
				this.advancePlayer();
				if (this.__bidResult) {
					const bidResult = this.__bidResult;
					let message = `${Player[bidResult.maker]} `;
					if (bidResult.stage === BidStage.Round1) {
						message += `ordered up the ${Rank[this.__trumpCandidate.rank]} of ${Suit[bidResult.trump]}`;
						this.__stage = BidStage.Discard;
					} else {
						message += `called ${Suit[bidResult.trump]}`;
						this.__stage = BidStage.Finished;
					}
					if (bidResult.alone) {
						message += " (alone)";
					}
					animShowText(message, MessageLevel.Step, 1);
				} else {
					animShowText(`${player} passed.`, MessageLevel.Step, 1);
					if (this.everyoneBid()) {
						if (this.__stage === BidStage.Round1) {
							this.__playersBid = 0;
							this.__stage = BidStage.Round2;
						} else {
							this.__stage = BidStage.Finished;
						}
					}
				}
				break;
			case BidStage.Discard:
				this.doDiscard(this.__dealer);
				this.__stage = BidStage.Finished;
				break;
			default:
				break;
		}
	}

	private doBid(stage: BidStage.Round1 | BidStage.Round2): BidResult | null {
		const aiPlayer = this.__aiPlayers[this.__currentPlayer];
		if (!aiPlayer) {
			return this.getHoomanBidResult(stage);
		}
		const hand = this.__playerHands[this.__currentPlayer];
		const trumpCandidate = this.__trumpCandidate;
		let trump: Suit | null = null;
		if (stage === BidStage.Round1) {
			const orderItUp = aiPlayer.chooseOrderUp(copyHand(hand), new Card(trumpCandidate), this.__dealer);
			if (!orderItUp || !hasSuit(hand, trumpCandidate.suit)) {
				return null;
			}
			trump = trumpCandidate.suit;
			this.__playerHands[this.__dealer].push(trumpCandidate);
		} else {
			trump = aiPlayer.pickTrump(copyHand(hand), new Card(trumpCandidate));
			if (trump === null || trump === trumpCandidate.suit || !hasSuit(hand, trump)) {
				return null;
			}
		}
		this.setTrump(trump);
		return {
			stage,
			trump,
			maker: this.__currentPlayer,
			alone: this.getGoAlone(trump, this.__currentPlayer),
		};
	}

	private getGoAlone(trump: Suit, maker: Player): boolean {
		let alone: boolean;
		const aiPlayer = this.__aiPlayers[maker];
		if (aiPlayer) {
			const hand = this.__playerHands[maker];
			alone = aiPlayer.chooseGoAlone(copyHand(hand), trump);
		} else {
			return false;
		}
		return alone;
	}

	private doDiscard(dealer: Player): void {
		const aiPlayer = this.__aiPlayers[dealer];
		const hand = this.__playerHands[dealer];
		let discard: Card | null = null;
		if (aiPlayer) {
			discard = aiPlayer.pickDiscard(copyHand(hand), this.__trumpCandidate.suit);
		}
		if (!discard || !isInHand(hand, discard)) {
			discard = hand[0];
		}
		for (let i = 0; i < hand.length; i++) {
			if (hand[i].id === discard.id) {
				hand.splice(i, 1);
				break;
			}
		}
	}

	private advancePlayer(): void {
		this.__currentPlayer = nextPlayer(this.__currentPlayer);
		this.__playersBid++;
	}

	private setTrump(trump: Suit) {
		const right = this.__jacks[trump];
		right.rank = Rank.Right;
		const left = this.__jacks[getOppositeSuit(trump)];
		left.suit = trump;
		left.rank = Rank.Left;
	}

	private everyoneBid() {
		return this.__playersBid === 4;
	}

	private isFinished(): boolean {
		return this.__stage === BidStage.Finished;
	}

	private getHoomanBidResult(stage: BidStage.Round1 | BidStage.Round2): BidResult | null {
		letHoomanBid();

		if (queuedHoomanBidSuit === null) {
			return null;
		}

		const bidResult: BidResult = {
			stage,
			trump: queuedHoomanBidSuit,
			maker: Player.South,
			alone: false,
		};

		queuedHoomanBidSuit = null;

		return bidResult;
	}

	/* Public functions */
	public doBidding(): BidResult | null {
		while (!this.isFinished()) {
			this.advanceBid();
		}
		return this.__bidResult;
	}
}
