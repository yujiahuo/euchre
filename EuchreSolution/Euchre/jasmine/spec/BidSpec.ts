class BiddingTestAI implements BiddingAI {
	private __orderUp: boolean;
	private __discard: Card | null;
	private __trumpSuit: Suit | null;
	private __goAlone: boolean;

	public constructor(orderUp: true, discard: Card | null, trumpSuit: null, goAlone: boolean);
	public constructor(orderUp: false, discard: null, trumpSuit: Suit, goAlone: boolean);
	public constructor(orderUp: false, discard: null, trumpSuit: null, goAlone: false);
	public constructor(orderUp: boolean, discard: Card | null, trumpSuit: Suit | null, goAlone: boolean) {
		this.__orderUp = orderUp;
		this.__discard = discard;
		this.__trumpSuit = trumpSuit;
		this.__goAlone = goAlone;
	}

	public init(): void { }

	public chooseOrderUp(): boolean {
		return this.__orderUp;
	}

	public pickDiscard(): Card | null {
		return this.__discard;
	}

	public pickTrump(): Suit | null {
		return this.__trumpSuit;
	}

	public chooseGoAlone(): boolean {
		return this.__goAlone;
	}
}

function testBid(description: string, hands: Card[][], aiPlayers: (EuchreAI | null)[], firstPlayer: Player, trumpCandidateCard: Card, maker: Player, trumpSuit: Suit, bidStage: BidStage, alone: boolean) {
	let bid: Bid;
	let bidResult: BidResult | null;

	describe(description, function () {
		beforeEach(function () {
			bid = new Bid(hands, aiPlayers, firstPlayer, trumpCandidateCard);
			bid.doBidding();
			bidResult = bid.bidResult();
		});

		it("currentPlayer", function () {
			expect(bid.currentPlayer()).toBe(nextPlayer(maker));
		});

		it("bidStage", function () {
			expect(bid.bidStage()).toBe(BidStage.BidFinished);
		});

		it("playersBid", function () {
			expect(bid.playersBid()).toBe((4 + (maker - firstPlayer)) % 4 + 1);
		});

		describe("bidResult", function () {
			let bidResult: BidResult;

			beforeEach(function () {
				bidResult = bid.bidResult() as BidResult;
			});

			it("is non-null", function () {
				expect(bidResult).toBeDefined();
			})

			it("maker", function () {
				expect(bidResult.maker).toBe(maker);
			});

			it("trumpSuit", function () {
				expect(bidResult.trumpSuit).toBe(trumpSuit);
			});

			it("bidStage", function () {
				expect(bidResult.bidStage).toBe(bidStage);
			});

			it("alone", function () {
				expect(bidResult.alone).toBe(alone);
			});
		});

		it("isFinished", function () {
			expect(bid.isFinished()).toBe(true);
		});
	});
}

describe("Bid", function () {
	let ordersItUpBiddingAI = new BiddingTestAI(true, null, null, false);
	let doesNothingAI = new IdiotAI();
	let ordersItUpAI = new MultiAI(ordersItUpBiddingAI, doesNothingAI);
	let callsClubsBiddingAI = new BiddingTestAI(false, null, Suit.Clubs, false);
	let callsClubsAI = new MultiAI(callsClubsBiddingAI, doesNothingAI);
	let callsDiamondsBiddingAI = new BiddingTestAI(false, null, Suit.Diamonds, false);
	let callsDiamondsAI = new MultiAI(callsDiamondsBiddingAI, doesNothingAI);
	let callsHeartsBiddingAI = new BiddingTestAI(false, null, Suit.Hearts, false);
	let callsHeartsAI = new MultiAI(callsHeartsBiddingAI, doesNothingAI);
	let callsSpadesBiddingAI = new BiddingTestAI(false, null, Suit.Spades, false);
	let callsSpadesAI = new MultiAI(callsSpadesBiddingAI, doesNothingAI);
	let hands = [
		[
			new Card(Suit.Spades, Rank.Jack),
			new Card(Suit.Clubs, Rank.Jack),
			new Card(Suit.Spades, Rank.Ace),
			new Card(Suit.Spades, Rank.King),
			new Card(Suit.Spades, Rank.Queen),
		],
		[
			new Card(Suit.Diamonds, Rank.Ace),
			new Card(Suit.Diamonds, Rank.King),
			new Card(Suit.Diamonds, Rank.Queen),
			new Card(Suit.Diamonds, Rank.Jack),
			new Card(Suit.Diamonds, Rank.Ten),
		],
		[
			new Card(Suit.Hearts, Rank.Ace),
			new Card(Suit.Hearts, Rank.King),
			new Card(Suit.Hearts, Rank.Queen),
			new Card(Suit.Hearts, Rank.Jack),
			new Card(Suit.Hearts, Rank.Ten),
		],
		[
			new Card(Suit.Clubs, Rank.Ace),
			new Card(Suit.Clubs, Rank.King),
			new Card(Suit.Clubs, Rank.Queen),
			new Card(Suit.Clubs, Rank.Ten),
			new Card(Suit.Spades, Rank.Ten),
		],
	];

	describe("Initial state", function () {
		let bid = new Bid([], [], Player.South, new Card(Suit.Clubs, Rank.Nine));
		it("currentPlayer", function () {
			expect(bid.currentPlayer()).toBe(Player.South);
		});

		it("bidStage", function () {
			expect(bid.bidStage()).toBe(BidStage.BidRound1);
		});

		it("playersBid", function () {
			expect(bid.playersBid()).toBe(0);
		});

		it("bidResult", function () {
			expect(bid.bidResult()).toBeNull();
		});

		it("isFinished", function () {
			expect(bid.isFinished()).toBe(false);
		});
	});

	testBid(
		"Enforces suits for ordering up (has suit)",
		hands,
		[ordersItUpAI, ordersItUpAI, ordersItUpAI, ordersItUpAI],
		Player.South,
		new Card(Suit.Hearts, Rank.Nine),
		Player.North,
		Suit.Hearts,
		BidStage.BidRound1,
		false,
	);

	testBid(
		"First player orders it up",
		hands,
		[ordersItUpAI, ordersItUpAI, ordersItUpAI, ordersItUpAI],
		Player.South,
		new Card(Suit.Clubs, Rank.Nine),
		Player.South,
		Suit.Clubs,
		BidStage.BidRound1,
		false,
	);

	testBid(
		"Second player orders it up",
		hands,
		[doesNothingAI, ordersItUpAI, ordersItUpAI, ordersItUpAI],
		Player.South,
		new Card(Suit.Diamonds, Rank.Nine),
		Player.West,
		Suit.Diamonds,
		BidStage.BidRound1,
		false,
	);

	testBid(
		"Third player orders it up",
		hands,
		[doesNothingAI, doesNothingAI, ordersItUpAI, ordersItUpAI],
		Player.South,
		new Card(Suit.Hearts, Rank.Nine),
		Player.North,
		Suit.Hearts,
		BidStage.BidRound1,
		false,
	);

	testBid(
		"Fourth player orders it up",
		hands,
		[doesNothingAI, doesNothingAI, doesNothingAI, ordersItUpAI],
		Player.South,
		new Card(Suit.Clubs, Rank.Nine),
		Player.East,
		Suit.Clubs,
		BidStage.BidRound1,
		false,
	);

	testBid(
		"Enforces suits for calling (has suit)",
		hands,
		[callsHeartsAI, callsHeartsAI, callsHeartsAI, callsHeartsAI],
		Player.South,
		new Card(Suit.Clubs, Rank.Nine),
		Player.North,
		Suit.Hearts,
		BidStage.BidRound2,
		false,
	);

	testBid(
		"Enforces suits for calling (wasn't trump suit)",
		hands,
		[callsSpadesAI, callsDiamondsAI, callsHeartsAI, callsClubsAI],
		Player.South,
		new Card(Suit.Spades, Rank.Nine),
		Player.West,
		Suit.Diamonds,
		BidStage.BidRound2,
		false,
	);

	testBid(
		"First player calls Spades",
		hands,
		[callsSpadesAI, callsDiamondsAI, callsHeartsAI, callsClubsAI],
		Player.South,
		new Card(Suit.Clubs, Rank.Nine),
		Player.South,
		Suit.Spades,
		BidStage.BidRound2,
		false,
	);

	testBid(
		"Second player calls Diamonds",
		hands,
		[doesNothingAI, callsDiamondsAI, callsHeartsAI, callsClubsAI],
		Player.South,
		new Card(Suit.Clubs, Rank.Nine),
		Player.West,
		Suit.Diamonds,
		BidStage.BidRound2,
		false,
	);

	testBid(
		"Third player calls Hearts",
		hands,
		[doesNothingAI, doesNothingAI, callsHeartsAI, callsClubsAI],
		Player.South,
		new Card(Suit.Clubs, Rank.Nine),
		Player.North,
		Suit.Hearts,
		BidStage.BidRound2,
		false,
	);

	testBid(
		"Fourth player calls Clubs",
		hands,
		[doesNothingAI, doesNothingAI, doesNothingAI, callsClubsAI],
		Player.South,
		new Card(Suit.Spades, Rank.Nine),
		Player.East,
		Suit.Clubs,
		BidStage.BidRound2,
		false,
	);

	describe("No one bids", function () {
		let aiPlayers = [doesNothingAI, doesNothingAI, doesNothingAI, doesNothingAI];
		let bid = new Bid(hands, aiPlayers, Player.South, new Card(Suit.Clubs, Rank.Nine));
		bid.doBidding();

		it("currentPlayer", function () {
			expect(bid.currentPlayer()).toBe(Player.South);
		});

		it("bidStage", function () {
			expect(bid.bidStage()).toBe(BidStage.BidFinished);
		});

		it("playersBid", function () {
			expect(bid.playersBid()).toBe(4);
		});

		it("bidResult", function () {
			expect(bid.bidResult()).toBeNull();
		});

		it("isFinished", function () {
			expect(bid.isFinished()).toBe(true);
		});
	});
});