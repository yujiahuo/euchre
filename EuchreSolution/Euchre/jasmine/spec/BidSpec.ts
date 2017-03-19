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

	it("Enforces card is in hand for discarding", function () {
		let discard = new Card(Suit.Hearts, Rank.Nine);
		let biddingAI = new BiddingTestAI(true, null, false, discard);
		let testAI = new MultiAI(biddingAI, doesNothingAI);
		let aiPlayers = [testAI, doesNothingAI, doesNothingAI, doesNothingAI];
		let {hands: playerHands, jacks} = copyHands(hands);
		let trumpCandidate = new Card(Suit.Spades, Rank.Nine);
		let bid = new Bid(playerHands, jacks, aiPlayers, Player.South, trumpCandidate);
		bid.doBidding();
		expect(playerHands[0].length).toBe(5);
	});

	it("Allows discarding a valid card", function () {
		let discard = new Card(Suit.Spades, Rank.Queen);
		let biddingAI = new BiddingTestAI(true, null, false, discard);
		let testAI = new MultiAI(biddingAI, doesNothingAI);
		let aiPlayers = [testAI, doesNothingAI, doesNothingAI, doesNothingAI];
		let {hands: playerHands, jacks} = copyHands(hands);
		let trumpCandidate = new Card(Suit.Spades, Rank.Nine);
		let bid = new Bid(playerHands, jacks, aiPlayers, Player.South, trumpCandidate);
		bid.doBidding();
		expect(playerHands[0].length).toBe(5);
		for (let card of playerHands[0]) {
			expect(card.id).not.toBe(discard.id);
		}
	});

	it("Allows discarding the trump candidate", function () {
		let discard = new Card(Suit.Spades, Rank.Nine);
		let biddingAI = new BiddingTestAI(true, null, false, discard);
		let testAI = new MultiAI(biddingAI, doesNothingAI);
		let aiPlayers = [testAI, doesNothingAI, doesNothingAI, doesNothingAI];
		let {hands: playerHands, jacks} = copyHands(hands);
		let trumpCandidate = new Card(Suit.Spades, Rank.Nine);
		let bid = new Bid(playerHands, jacks, aiPlayers, Player.South, trumpCandidate);
		bid.doBidding();
		expect(playerHands[0].length).toBe(5);
		for (let card of playerHands[0]) {
			expect(card.id).not.toBe(discard.id);
		}
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

	describe("Jacks are updated when trump is called", function () {
		let testAI: EuchreAI;
		let aiPlayers: EuchreAI[];
		let trumpCandidate: Card;
		let bid: Bid;

		beforeEach(function () {
			aiPlayers = [doesNothingAI, doesNothingAI, doesNothingAI, doesNothingAI];
			let {hands: playerHands, jacks} = copyHands(hands);
			trumpCandidate = new Card(Suit.Spades, Rank.Nine);
			bid = new Bid(playerHands, jacks, aiPlayers, Player.South, trumpCandidate);
		});

		it("Does not update the jacks before trump is called", function () {
			testAI = new IdiotAI();
			let orderUpSpy = spyOn(testAI, "chooseOrderUp").and.callThrough();
			let pickTrumpSpy = spyOn(testAI, "pickTrump").and.callThrough();
			aiPlayers[0] = testAI;
			bid.doBidding();

			expect(orderUpSpy.calls.count()).toBe(1);
			let [orderUpHand, orderUpTrumpCandidate] = orderUpSpy.calls.argsFor(0);
			for (let card of orderUpHand as Card[]) {
				expect(card.rank).toBeLessThanOrEqual(Rank.Ace);
			}
			expect((orderUpTrumpCandidate as Card).rank).toBeLessThanOrEqual(Rank.Ace);

			expect(pickTrumpSpy.calls.count()).toBe(1);
			let [pickTrumpHand, pickTrumpTrumpCandidate] = orderUpSpy.calls.argsFor(0);
			for (let card of pickTrumpHand as Card[]) {
				expect(card.rank).toBeLessThanOrEqual(Rank.Ace);
			}
			expect((pickTrumpTrumpCandidate as Card).rank).toBeLessThanOrEqual(Rank.Ace);
		});

		it("Updates the jacks after it is ordered up", function () {
			testAI = ordersItUpAI;
			let chooseGoAloneSpy = spyOn(testAI, "chooseGoAlone").and.callThrough();
			let pickDiscardSpy = spyOn(testAI, "pickDiscard").and.callThrough();
			aiPlayers[0] = testAI;
			bid.doBidding();

			expect(chooseGoAloneSpy.calls.count()).toBe(1);
			let [goAloneHand, goAloneSuit] = chooseGoAloneSpy.calls.argsFor(0);
			let rightId = new Card(goAloneSuit, Rank.Jack).id
			let leftId = new Card(getOppositeSuit(goAloneSuit), Rank.Jack).id
			for (let card of goAloneHand as Card[]) {
				if (card.id === rightId) {
					expect(card.rank).toBe(Rank.Right);
					expect(card.suit).toBe(goAloneSuit);
				} else if (card.id === leftId) {
					expect(card.rank).toBe(Rank.Left);
					expect(card.suit).toBe(goAloneSuit);
				} else {
					expect(card.rank).toBeLessThanOrEqual(Rank.Ace);
				}
			}

			expect(pickDiscardSpy.calls.count()).toBe(1);
			let [discardHand] = chooseGoAloneSpy.calls.argsFor(0);
			for (let card of discardHand as Card[]) {
				if (card.id === rightId) {
					expect(card.rank).toBe(Rank.Right);
					expect(card.suit).toBe(goAloneSuit);
				} else if (card.id === leftId) {
					expect(card.rank).toBe(Rank.Left);
					expect(card.suit).toBe(goAloneSuit);
				} else {
					expect(card.rank).toBeLessThanOrEqual(Rank.Ace);
				}
			}
		});

		it("Updates the jacks after it is called", function () {
			testAI = callsClubsAI;
			let trump = Suit.Clubs;
			let rightId = new Card(trump, Rank.Jack).id
			let leftId = new Card(getOppositeSuit(trump), Rank.Jack).id
			let chooseGoAloneSpy = spyOn(testAI, "chooseGoAlone").and.callThrough();
			aiPlayers[0] = testAI;
			bid.doBidding();

			expect(chooseGoAloneSpy.calls.count()).toBe(1);
			let [hand] = chooseGoAloneSpy.calls.argsFor(0);
			for (let card of hand as Card[]) {
				if (card.id === rightId) {
					expect(card.rank).toBe(Rank.Right);
					expect(card.suit).toBe(trump);
				} else if (card.id === leftId) {
					expect(card.rank).toBe(Rank.Left);
					expect(card.suit).toBe(trump);
				} else {
					expect(card.rank).toBeLessThanOrEqual(Rank.Ace);
				}
			}
		});
	});
});
