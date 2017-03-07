enum HandStage {
	Bidding,
	Discard,
	PlayTricks,
	Finished,
}

type ShuffleResult = {
	deck: Card[],
	jacks: Card[],
};

function getShuffledDeck(): ShuffleResult {
	let deck: Card[] = [];
	let jacks: Card[] = [];

	for (let i = 0; i < DECKSIZE; i++) {
		let j = rng.nextInRange(0, i);
		if (j !== i) {
			deck[i] = deck[j];
		}
		deck[j] = new Card(SORTEDDECK[i]);
		if (deck[j].rank === Rank.Jack) {
			jacks[deck[j].suit] = deck[j];
		}
	}

	return {
		deck: deck,
		jacks: jacks,
	};
}

function dealHands(deck: Card[], playerHands: Card[][], dealer: Player): void {
	for (let i = 0; i < 20; i++) {
		let player = (dealer + i) % 4;
		let cardPos = Math.floor(i / 4);
		//TODO: see if skipping the pop makes things faster
		playerHands[player][cardPos] = deck.pop() as Card;
	}
}

function calculatePointGain(tricksTaken: number, maker: boolean, alone?: boolean, defendingAlone?: boolean): number {
	if (tricksTaken < 3) return 0;

	if (maker) {
		if (tricksTaken === 5) {
			return alone ? 4 : 2;
		}
		else {
			return 1;
		}
	}
	else {
		return alone && defendingAlone ? 4 : 2;
	}
}

class Hand {
	//General stuff
	private __dealer: Player;
	private __playerHands: Card[][]; //2d array of everyone's hands
	private __aiPlayers: (EuchreAI | null)[];
	private __handStage: HandStage;

	//Bidding related
	private __bid: Bid;
	private __bidResult: BidResult | null;
	private __trumpCandidate: Card; //turned up card

	//Playing related
	private __trick: Trick;
	private __numTricksPlayed = 0;
	private __numPlayers = 4; //players playing this hand; this is usually 4 but can be 3 or 2 depending on loners
	private __nsTricksWon = 0;
	private __ewTricksWon = 0;
	private __nsPointsWon = 0;
	private __ewPointsWon = 0;
	private __jacks: Card[] = [];

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
	public trumpCandidate(): Card | undefined {
		return this.__trumpCandidate;
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
	public nsPointsWon(): number {
		return this.__nsPointsWon;
	}
	public ewPointsWon(): number {
		return this.__ewPointsWon;
	}

	/* constructor */
	constructor(dealer: Player, aiPlayers: (EuchreAI | null)[]) {
		this.__dealer = dealer;
		this.__aiPlayers = aiPlayers;

		//set up the deck and everyone's hands
		let {deck, jacks} = getShuffledDeck();
		this.__playerHands = [[], [], [], []];
		this.__jacks = jacks;
		dealHands(deck, this.__playerHands, this.__dealer);
		this.__trumpCandidate = deck.pop() as Card;

		//set up bidding
		this.__handStage = HandStage.Bidding;
		this.__bid = new Bid(this.__playerHands, this.__aiPlayers, this.__dealer, this.__trumpCandidate);
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
				let bidResult = this.__bidResult as BidResult;
				this.__trick = new Trick(bidResult.trump, bidResult.alone, this.__playerHands, this.__aiPlayers, bidResult.maker, nextPlayer(this.__dealer));
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

		if (bidResult.alone) {
			this.__numPlayers--;
			/*if (bidResult.defendAlone) {
				this.__numPlayers--;
			}*/
		}

		//This chunk is for changing the rank and suit of the right and left bowers
		//for the duration of the hand.
		//Note: The cards' IDs stay the same
		let trump = bidResult.trump;
		let right = this.__jacks[trump];
		right.rank = Rank.Right;
		let left = this.__jacks[getOppositeSuit(trump)];
		left.suit = trump;
		left.rank = Rank.Left;

		if (bidResult.stage === BidStage.Round1) {
			this.addToHand(this.__dealer, this.__trumpCandidate);
			this.__handStage = HandStage.Discard;
		}
		else {
			this.__handStage = HandStage.PlayTricks;
			this.__trick = new Trick(bidResult.trump, bidResult.alone, this.__playerHands, this.__aiPlayers, bidResult.maker, nextPlayer(this.__dealer));
		}
	}

	private discard(): void {
		let aiPlayer = this.__aiPlayers[this.__dealer];
		let toDiscard: Card | null = null;

		if (aiPlayer !== null) {
			let bidResult = this.__bidResult as BidResult;
			toDiscard = aiPlayer.pickDiscard(this.__playerHands[this.__dealer], bidResult.trump);
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
		if (this.__numTricksPlayed >= 5) {
			this.endHand(true);
		} else {
			let bidResult = this.__bidResult as BidResult;
			this.__trick = new Trick(bidResult.trump, bidResult.alone, this.__playerHands, this.__aiPlayers, bidResult.maker, this.__trick.currentPlayer());
		}
	}

	private endHand(completed: boolean): void {
		if (!completed || !this.__bidResult) {
			this.__handStage = HandStage.Finished;
			return; //TODO: deal with no one bidding
		}

		let isMaker = (this.__bidResult.maker === Player.North || this.__bidResult.maker === Player.South);
		this.__nsPointsWon = calculatePointGain(this.__nsTricksWon, isMaker, this.__bidResult.alone);
		this.__ewPointsWon = calculatePointGain(this.__ewTricksWon, !isMaker, this.__bidResult.alone);

		this.__handStage = HandStage.Finished;
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

	/* Public functions */
	public doHand(): void {
		while (!this.isFinished()) {
			this.advanceHand();
		}
		return;
	}

	public isFinished(): boolean {
		return this.__handStage === HandStage.Finished;
	}
}
