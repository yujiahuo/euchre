function copyHands(hands: Card[][]): { hands: Card[][], jacks: Card[] } {
	let playerHands: Card[][] = [[], [], [], []];
	let jacks: Card[] = [];
	for (let i = 0; i < hands.length; i++) {
		for (let j = 0; j < hands[i].length; j++) {
			let card = new Card(hands[i][j]);
			playerHands[i].push(card);
			if (card.rank === Rank.Jack) {
				jacks[card.suit] = card;
			}
		}
	}
	return {
		hands: playerHands,
		jacks: jacks,
	}
}

function testBid(description: string, hands: Card[][], aiPlayers: (EuchreAI | null)[],
	dealer: Player, trumpCandidate: Card, maker: Player, trump: Suit,
	stage: BidStage, alone: boolean) {
	let bid: Bid;
	let bidResult: BidResult

	describe(description, function () {
		beforeEach(function () {
			let {hands: playerHands, jacks} = copyHands(hands);
			bid = new Bid(playerHands, jacks, aiPlayers, dealer, trumpCandidate);
			bidResult = bid.doBidding() as BidResult;
		});

		it("bid result is non-null", function () {
			expect(bidResult).not.toBeNull();
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
}

describe("BidSpec", function () {
	let ordersItUpBiddingAI = new BiddingTestAI(true, null, false);
	let ordersItUpAloneBiddingAI = new BiddingTestAI(true, null, true);
	let doesNothingAI = new IdiotAI();
	let ordersItUpAI = new MultiAI(ordersItUpBiddingAI, doesNothingAI);
	let ordersItUpAloneAI = new MultiAI(ordersItUpAloneBiddingAI, doesNothingAI);
	let callsClubsBiddingAI = new BiddingTestAI(false, Suit.Clubs, false);
	let callsClubsAI = new MultiAI(callsClubsBiddingAI, doesNothingAI);
	let callsClubsAloneBiddingAI = new BiddingTestAI(false, Suit.Clubs, true);
	let callsClubsAloneAI = new MultiAI(callsClubsAloneBiddingAI, doesNothingAI);
	let callsDiamondsBiddingAI = new BiddingTestAI(false, Suit.Diamonds, false);
	let callsDiamondsAI = new MultiAI(callsDiamondsBiddingAI, doesNothingAI);
	let callsDiamondsAloneBiddingAI = new BiddingTestAI(false, Suit.Diamonds, true);
	let callsDiamondsAloneAI = new MultiAI(callsDiamondsAloneBiddingAI, doesNothingAI);
	let callsHeartsBiddingAI = new BiddingTestAI(false, Suit.Hearts, false);
	let callsHeartsAI = new MultiAI(callsHeartsBiddingAI, doesNothingAI);
	let callsHeartsAloneBiddingAI = new BiddingTestAI(false, Suit.Hearts, true);
	let callsHeartsAloneAI = new MultiAI(callsHeartsAloneBiddingAI, doesNothingAI);
	let callsSpadesBiddingAI = new BiddingTestAI(false, Suit.Spades, false);
	let callsSpadesAI = new MultiAI(callsSpadesBiddingAI, doesNothingAI);
	let callsSpadesAloneBiddingAI = new BiddingTestAI(false, Suit.Spades, true);
	let callsSpadesAloneAI = new MultiAI(callsSpadesAloneBiddingAI, doesNothingAI);
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
		"First player orders it up alone",
		hands,
		[ordersItUpAloneAI, ordersItUpAloneAI, ordersItUpAloneAI, ordersItUpAloneAI],
		Player.East,
		new Card(Suit.Clubs, Rank.Nine),
		Player.South,
		Suit.Clubs,
		BidStage.Round1,
		true,
	);

	testBid(
		"Second player orders it up alone",
		hands,
		[doesNothingAI, ordersItUpAloneAI, ordersItUpAloneAI, ordersItUpAloneAI],
		Player.East,
		new Card(Suit.Diamonds, Rank.Nine),
		Player.West,
		Suit.Diamonds,
		BidStage.Round1,
		true,
	);

	testBid(
		"Third player orders it up alone",
		hands,
		[doesNothingAI, doesNothingAI, ordersItUpAloneAI, ordersItUpAloneAI],
		Player.East,
		new Card(Suit.Hearts, Rank.Nine),
		Player.North,
		Suit.Hearts,
		BidStage.Round1,
		true,
	);

	testBid(
		"Fourth player orders it up alone",
		hands,
		[doesNothingAI, doesNothingAI, doesNothingAI, ordersItUpAloneAI],
		Player.East,
		new Card(Suit.Clubs, Rank.Nine),
		Player.East,
		Suit.Clubs,
		BidStage.Round1,
		true,
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

	testBid(
		"First player calls Spades alone",
		hands,
		[callsSpadesAloneAI, callsDiamondsAloneAI, callsHeartsAloneAI, callsClubsAloneAI],
		Player.East,
		new Card(Suit.Clubs, Rank.Nine),
		Player.South,
		Suit.Spades,
		BidStage.Round2,
		true,
	);

	testBid(
		"Second player calls Diamonds alone",
		hands,
		[doesNothingAI, callsDiamondsAloneAI, callsHeartsAloneAI, callsClubsAloneAI],
		Player.East,
		new Card(Suit.Clubs, Rank.Nine),
		Player.West,
		Suit.Diamonds,
		BidStage.Round2,
		true,
	);

	testBid(
		"Third player calls Hearts alone",
		hands,
		[doesNothingAI, doesNothingAI, callsHeartsAloneAI, callsClubsAloneAI],
		Player.East,
		new Card(Suit.Clubs, Rank.Nine),
		Player.North,
		Suit.Hearts,
		BidStage.Round2,
		true,
	);

	testBid(
		"Fourth player calls Clubs alone",
		hands,
		[doesNothingAI, doesNothingAI, doesNothingAI, callsClubsAloneAI],
		Player.East,
		new Card(Suit.Spades, Rank.Nine),
		Player.East,
		Suit.Clubs,
		BidStage.Round2,
		true,
	);

	describe("No one bids", function () {
		let aiPlayers = [doesNothingAI, doesNothingAI, doesNothingAI, doesNothingAI];
		let {hands: playerHands, jacks} = copyHands(hands);
		let trumpCandidate = new Card(Suit.Clubs, Rank.Nine);
		let bid: Bid;
		let bidResult: BidResult | null;
		beforeEach(function () {
			bid = new Bid(playerHands, jacks, aiPlayers, Player.East, trumpCandidate);
			bidResult = bid.doBidding();
		});

		it("Returns null", function () {
			expect(bidResult).toBeNull();
		});
	});
});
