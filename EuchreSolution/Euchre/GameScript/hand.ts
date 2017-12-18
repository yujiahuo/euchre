enum HandStage {
	Bidding,
	Playing,
	Finished,
}

// tslint:disable-next-line:interface-over-type-literal
type ShuffleResult = {
	deck: Card[],
	jacks: Card[],
};

function getShuffledDeck(): ShuffleResult {
	let deck: Card[] = [];
	let jacks: Card[] = [];

	for (let i = 0; i < DECKSIZE; i++) {
		const j = rng.nextInRange(0, i);
		if (j !== i) {
			deck[i] = deck[j];
		}
		deck[j] = new Card(SORTEDDECK[i]);
		if (deck[j].rank === Rank.Jack) {
			jacks[deck[j].suit] = deck[j];
		}
	}

	//TODO: remove hardcoded values (debug code!!)
	const hands = [
		[
			new Card(Suit.Spades, Rank.Jack),
			new Card(Suit.Spades, Rank.Ace),
			new Card(Suit.Spades, Rank.King),
			new Card(Suit.Spades, Rank.Queen),
			new Card(Suit.Spades, Rank.Ten),
		],
		[
			new Card(Suit.Clubs, Rank.Jack),
			new Card(Suit.Diamonds, Rank.Ace),
			new Card(Suit.Diamonds, Rank.King),
			new Card(Suit.Diamonds, Rank.Queen),
			new Card(Suit.Clubs, Rank.Ace),
		],
		[
			new Card(Suit.Diamonds, Rank.Jack),
			new Card(Suit.Diamonds, Rank.Ten),
			new Card(Suit.Diamonds, Rank.Nine),
			new Card(Suit.Clubs, Rank.King),
			new Card(Suit.Hearts, Rank.Ace),
		],
		[
			new Card(Suit.Hearts, Rank.King),
			new Card(Suit.Hearts, Rank.Queen),
			new Card(Suit.Clubs, Rank.Queen),
			new Card(Suit.Hearts, Rank.Ten),
			new Card(Suit.Hearts, Rank.Nine),
		],
	];
	const kitty = [
		new Card(Suit.Spades, Rank.Nine),
		new Card(Suit.Clubs, Rank.Ten),
		new Card(Suit.Clubs, Rank.Nine),
		new Card(Suit.Hearts, Rank.Jack),
	];
	const { deck: newDeck, jacks: newJacks } = getDeckFromHands(hands, kitty);
	deck = newDeck;
	jacks = newJacks;
	return { deck, jacks };
}

//TODO: remove (debug code)
//Assumes East is permadealer
function getDeckFromHands(hands: Card[][], kitty: Card[]): ShuffleResult {
	const deck = [];
	const jacks = [];
	while (kitty.length > 0) {
		const card = kitty.pop() as Card;
		if (card.rank === Rank.Jack) {
			jacks[card.suit] = card;
		}
		deck.push(card);
	}

	for (let i = 3; hands[i].length > 0; i = (i + 3) % 4) {
		const card = hands[i].pop() as Card;
		if (card.rank === Rank.Jack) {
			jacks[card.suit] = card;
		}
		deck.push(card);
	}

	return { deck, jacks };
}

function dealHands(deck: Card[], playerHands: Card[][], dealer: Player): void {
	for (let i = 0; i < 20; i++) {
		const player = (dealer + i + 1) % 4;
		const cardPos = Math.floor(i / 4);
		//TODO: see if skipping the pop makes things faster
		playerHands[player][cardPos] = deck.pop() as Card;
	}
}

function calculatePointGain(tricksTaken: number, maker: boolean, alone?: boolean): number;
function calculatePointGain(tricksTaken: number, maker: boolean, alone: true, defendingAlone: boolean): number;
function calculatePointGain(tricksTaken: number, maker: boolean, alone: false, defendingAlone: false): number;
function calculatePointGain(tricksTaken: number, maker: boolean, alone?: boolean, defendingAlone?: boolean): number {
	if (tricksTaken < 3) { return 0; }

	if (maker) {
		if (tricksTaken === 5) {
			return alone ? 4 : 2;
		} else {
			return 1;
		}
	} else {
		return alone && defendingAlone ? 4 : 2;
	}
}

class Hand {
	//General stuff
	private __settings: Settings;
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
	private __nsTricksWon = 0;
	private __ewTricksWon = 0;
	private __nsPointsWon = 0;
	private __ewPointsWon = 0;

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
	constructor(dealer: Player, aiPlayers: (EuchreAI | null)[], settings: Settings) {
		this.__settings = settings;
		this.__dealer = dealer;
		this.__dealer = Player.East;  //TODO: remove (debug code!!)
		this.__aiPlayers = aiPlayers;
		let player = dealer;
		for (let i = 0; i < 4; i++) {
			player = nextPlayer(player);
			const aiPlayer = aiPlayers[player];
			if (aiPlayer) {
				aiPlayer.init(player);
			}
		}

		//set up the deck and everyone's hands
		const { deck, jacks } = getShuffledDeck();
		this.__playerHands = [[], [], [], []];
		dealHands(deck, this.__playerHands, this.__dealer);
		this.__trumpCandidate = deck.pop() as Card;

		animDeal(this.__playerHands, this.__trumpCandidate, this.__dealer, this.__settings);
		animPlaceDealerButt(this.__dealer);

		//set up bidding
		this.__handStage = HandStage.Bidding;
		this.__bid = new Bid(this.__playerHands, jacks, this.__aiPlayers, this.__dealer, this.__trumpCandidate);
	}

	private advanceHand(): void {
		switch (this.__handStage) {
			case HandStage.Bidding:
				const bidResult = this.__bid.doBidding();

				if (pausing) { return; }

				this.__bidResult = bidResult;
				if (bidResult) {
					this.__trick = new Trick(bidResult.trump, bidResult.alone,
						this.__playerHands, this.__aiPlayers, bidResult.maker,
						nextPlayer(this.__dealer));
					this.__handStage = HandStage.Playing;
				} else {
					this.endHand(false);
				}
				break;
			case HandStage.Playing:
				const trickEnded = this.__trick.doTrick();

				if (pausing) { return; }

				if (trickEnded) {
					this.handleEndTrick();
				}
				break;
			default:
				break;
		}
	}

	private handleEndTrick(): void {
		if (this.__trick.winningTeam() === Team.NorthSouth) {
			this.__nsTricksWon++;
			animShowText("NS won this trick", MessageLevel.Step, 2);
		} else {
			this.__ewTricksWon++;
			animShowText("EW won this trick", MessageLevel.Step, 2);
		}
		this.__numTricksPlayed++;
		if (this.__numTricksPlayed >= 5) {
			this.endHand(true);
		} else {
			const bidResult = this.__bidResult as BidResult;
			this.__trick = new Trick(bidResult.trump, bidResult.alone, this.__playerHands,
				this.__aiPlayers, bidResult.maker, this.__trick.winner() as Player);
		}
	}

	private endHand(completed: boolean): void {
		if (!completed || !this.__bidResult) {
			this.__handStage = HandStage.Finished;
			return; //TODO: deal with no one bidding
		}

		const isMaker = (this.__bidResult.maker === Player.North || this.__bidResult.maker === Player.South);
		this.__nsPointsWon = calculatePointGain(this.__nsTricksWon, isMaker, this.__bidResult.alone);
		this.__ewPointsWon = calculatePointGain(this.__ewTricksWon, !isMaker, this.__bidResult.alone);

		this.__handStage = HandStage.Finished;
	}

	/* Public functions */
	public doHand(): void {
		while (!this.isFinished() && !pausing) {
			this.advanceHand();
		}
		return;
	}

	public isFinished(): boolean {
		return this.__handStage === HandStage.Finished;
	}
}
