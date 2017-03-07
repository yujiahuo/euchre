function testBid(description: string, hands: Card[][], aiPlayers: (EuchreAI | null)[], dealer: Player, trumpCandidate: Card, maker: Player, trump: Suit, stage: BidStage, alone: boolean) {
	let bid: Bid;
	let bidResult: BidResult | null;

	describe(description, function () {
		beforeEach(function () {
			bid = new Bid(hands, aiPlayers, dealer, trumpCandidate);
			bid.doBidding();
			bidResult = bid.bidResult();
		});

		it("currentPlayer", function () {
			expect(bid.currentPlayer()).toBe(nextPlayer(maker));
		});

		it("stage", function () {
			expect(bid.stage()).toBe(BidStage.Finished);
		});

		it("playersBid", function () {
			let expectedResult = (4 + (maker - dealer)) % 4;
			if (expectedResult === 0) {
				expectedResult = 4;
			}
			expect(bid.playersBid()).toBe(expectedResult);
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

			it("trump", function () {
				expect(bidResult.trump).toBe(trump);
			});

			it("stage", function () {
				expect(bidResult.stage).toBe(stage);
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

describe("BidSpec", function () {
	let ordersItUpBiddingAI = new BiddingTestAI(true, null, false);
	let doesNothingAI = new IdiotAI();
	let ordersItUpAI = new MultiAI(ordersItUpBiddingAI, doesNothingAI);
	let callsClubsBiddingAI = new BiddingTestAI(false, Suit.Clubs, false);
	let callsClubsAI = new MultiAI(callsClubsBiddingAI, doesNothingAI);
	let callsDiamondsBiddingAI = new BiddingTestAI(false, Suit.Diamonds, false);
	let callsDiamondsAI = new MultiAI(callsDiamondsBiddingAI, doesNothingAI);
	let callsHeartsBiddingAI = new BiddingTestAI(false, Suit.Hearts, false);
	let callsHeartsAI = new MultiAI(callsHeartsBiddingAI, doesNothingAI);
	let callsSpadesBiddingAI = new BiddingTestAI(false, Suit.Spades, false);
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
		let bid = new Bid([], [], Player.East, new Card(Suit.Clubs, Rank.Nine));
		it("currentPlayer", function () {
			expect(bid.currentPlayer()).toBe(Player.South);
		});

		it("stage", function () {
			expect(bid.stage()).toBe(BidStage.Round1);
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
		Player.East,
		new Card(Suit.Hearts, Rank.Nine),
		Player.North,
		Suit.Hearts,
		BidStage.Round1,
		false,
	);

	testBid(
		"First player orders it up",
		hands,
		[ordersItUpAI, ordersItUpAI, ordersItUpAI, ordersItUpAI],
		Player.East,
		new Card(Suit.Clubs, Rank.Nine),
		Player.South,
		Suit.Clubs,
		BidStage.Round1,
		false,
	);

	testBid(
		"Second player orders it up",
		hands,
		[doesNothingAI, ordersItUpAI, ordersItUpAI, ordersItUpAI],
		Player.East,
		new Card(Suit.Diamonds, Rank.Nine),
		Player.West,
		Suit.Diamonds,
		BidStage.Round1,
		false,
	);

	testBid(
		"Third player orders it up",
		hands,
		[doesNothingAI, doesNothingAI, ordersItUpAI, ordersItUpAI],
		Player.East,
		new Card(Suit.Hearts, Rank.Nine),
		Player.North,
		Suit.Hearts,
		BidStage.Round1,
		false,
	);

	testBid(
		"Fourth player orders it up",
		hands,
		[doesNothingAI, doesNothingAI, doesNothingAI, ordersItUpAI],
		Player.East,
		new Card(Suit.Clubs, Rank.Nine),
		Player.East,
		Suit.Clubs,
		BidStage.Round1,
		false,
	);

	testBid(
		"Enforces suits for calling (has suit)",
		hands,
		[callsHeartsAI, callsHeartsAI, callsHeartsAI, callsHeartsAI],
		Player.East,
		new Card(Suit.Clubs, Rank.Nine),
		Player.North,
		Suit.Hearts,
		BidStage.Round2,
		false,
	);

	testBid(
		"Enforces suits for calling (wasn't trump suit)",
		hands,
		[callsSpadesAI, callsDiamondsAI, callsHeartsAI, callsClubsAI],
		Player.East,
		new Card(Suit.Spades, Rank.Nine),
		Player.West,
		Suit.Diamonds,
		BidStage.Round2,
		false,
	);

	testBid(
		"First player calls Spades",
		hands,
		[callsSpadesAI, callsDiamondsAI, callsHeartsAI, callsClubsAI],
		Player.East,
		new Card(Suit.Clubs, Rank.Nine),
		Player.South,
		Suit.Spades,
		BidStage.Round2,
		false,
	);

	testBid(
		"Second player calls Diamonds",
		hands,
		[doesNothingAI, callsDiamondsAI, callsHeartsAI, callsClubsAI],
		Player.East,
		new Card(Suit.Clubs, Rank.Nine),
		Player.West,
		Suit.Diamonds,
		BidStage.Round2,
		false,
	);

	testBid(
		"Third player calls Hearts",
		hands,
		[doesNothingAI, doesNothingAI, callsHeartsAI, callsClubsAI],
		Player.East,
		new Card(Suit.Clubs, Rank.Nine),
		Player.North,
		Suit.Hearts,
		BidStage.Round2,
		false,
	);

	testBid(
		"Fourth player calls Clubs",
		hands,
		[doesNothingAI, doesNothingAI, doesNothingAI, callsClubsAI],
		Player.East,
		new Card(Suit.Spades, Rank.Nine),
		Player.East,
		Suit.Clubs,
		BidStage.Round2,
		false,
	);

	describe("No one bids", function () {
		let aiPlayers = [doesNothingAI, doesNothingAI, doesNothingAI, doesNothingAI];
		let bid = new Bid(hands, aiPlayers, Player.East, new Card(Suit.Clubs, Rank.Nine));
		bid.doBidding();

		it("currentPlayer", function () {
			expect(bid.currentPlayer()).toBe(Player.South);
		});

		it("stage", function () {
			expect(bid.stage()).toBe(BidStage.Finished);
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
