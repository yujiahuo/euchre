function copyHands(hands: Card[][]): { hands: Card[][], jacks: Card[] } {
	const playerHands: Card[][] = [[], [], [], []];
	const jacks: Card[] = [];
	for (let i = 0; i < hands.length; i++) {
		for (const card of hands[i]) {
			const newCard = new Card(card);
			playerHands[i].push(newCard);
			if (newCard.rank === Rank.Jack) {
				jacks[newCard.suit] = newCard;
			}
		}
	}
	return {
		hands: playerHands,
		jacks,
	};
}

function testBid(description: string, hands: Card[][], aiPlayers: (EuchreAI | null)[],
	dealer: Player, trumpCandidate: Card, maker: Player, trump: Suit,
	stage: BidStage, alone: boolean) {
	let bid: Bid;
	let bidResult: BidResult;

	describe(description, function () {
		beforeEach(function (done: DoneFn) {
			const { hands: playerHands, jacks } = copyHands(hands);
			const callback = (result: BidResult | null) => {
				bidResult = result as BidResult;
				done();
			};
			bid = new Bid(callback, playerHands, jacks, aiPlayers, dealer, trumpCandidate);
			bid.doBidding();
		});

		it("bid result is non-null", function () {
			expect(bidResult).not.toBeNull();
		});

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
	const ordersItUpBiddingAI = new BiddingTestAI(true, null, false);
	const ordersItUpAloneBiddingAI = new BiddingTestAI(true, null, true);
	const doesNothingAI = new IdiotAI();
	const ordersItUpAI = new MultiAI(ordersItUpBiddingAI, doesNothingAI);
	const ordersItUpAloneAI = new MultiAI(ordersItUpAloneBiddingAI, doesNothingAI);
	const callsClubsBiddingAI = new BiddingTestAI(false, Suit.Clubs, false);
	const callsClubsAI = new MultiAI(callsClubsBiddingAI, doesNothingAI);
	const callsClubsAloneBiddingAI = new BiddingTestAI(false, Suit.Clubs, true);
	const callsClubsAloneAI = new MultiAI(callsClubsAloneBiddingAI, doesNothingAI);
	const callsDiamondsBiddingAI = new BiddingTestAI(false, Suit.Diamonds, false);
	const callsDiamondsAI = new MultiAI(callsDiamondsBiddingAI, doesNothingAI);
	const callsDiamondsAloneBiddingAI = new BiddingTestAI(false, Suit.Diamonds, true);
	const callsDiamondsAloneAI = new MultiAI(callsDiamondsAloneBiddingAI, doesNothingAI);
	const callsHeartsBiddingAI = new BiddingTestAI(false, Suit.Hearts, false);
	const callsHeartsAI = new MultiAI(callsHeartsBiddingAI, doesNothingAI);
	const callsHeartsAloneBiddingAI = new BiddingTestAI(false, Suit.Hearts, true);
	const callsHeartsAloneAI = new MultiAI(callsHeartsAloneBiddingAI, doesNothingAI);
	const callsSpadesBiddingAI = new BiddingTestAI(false, Suit.Spades, false);
	const callsSpadesAI = new MultiAI(callsSpadesBiddingAI, doesNothingAI);
	const callsSpadesAloneBiddingAI = new BiddingTestAI(false, Suit.Spades, true);
	const callsSpadesAloneAI = new MultiAI(callsSpadesAloneBiddingAI, doesNothingAI);
	const hands = [
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

	describe("Enforces card is in hand for discarding", function () {
		let firstPlayerHand: Card[];

		beforeEach(function (done: DoneFn) {
			const discard = new Card(Suit.Hearts, Rank.Nine);
			const biddingAI = new BiddingTestAI(true, null, false, discard);
			const testAI = new MultiAI(biddingAI, doesNothingAI);
			const aiPlayers = [testAI, doesNothingAI, doesNothingAI, doesNothingAI];
			const { hands: playerHands, jacks } = copyHands(hands);
			firstPlayerHand = playerHands[0];
			const trumpCandidate = new Card(Suit.Spades, Rank.Nine);
			const bid = new Bid(done, playerHands, jacks, aiPlayers, Player.South, trumpCandidate);
			bid.doBidding();
		});
		it("Still discards something", function () {
			expect(firstPlayerHand.length).toBe(5);
		});
	});

	describe("Allows discarding a valid card", () => {
		let discard: Card;
		let firstPlayerHand: Card[];

		beforeEach((done: DoneFn) => {
			discard = new Card(Suit.Spades, Rank.Queen);
			const biddingAI = new BiddingTestAI(true, null, false, discard);
			const testAI = new MultiAI(biddingAI, doesNothingAI);
			const aiPlayers = [testAI, doesNothingAI, doesNothingAI, doesNothingAI];
			const { hands: playerHands, jacks } = copyHands(hands);
			firstPlayerHand = playerHands[0];
			const trumpCandidate = new Card(Suit.Spades, Rank.Nine);
			const bid = new Bid(done, playerHands, jacks, aiPlayers, Player.South, trumpCandidate);
			bid.doBidding();
		});
		it("Discarded the right card", () => {
			expect(firstPlayerHand.length).toBe(5);
			for (const card of firstPlayerHand) {
				expect(card.id).not.toBe(discard.id);
			}
		});
	});

	describe("Allows discarding the trump candidate", () => {
		let discard: Card;
		let firstPlayerHand: Card[];

		beforeEach((done: DoneFn) => {
			discard = new Card(Suit.Spades, Rank.Nine);
			const biddingAI = new BiddingTestAI(true, null, false, discard);
			const testAI = new MultiAI(biddingAI, doesNothingAI);
			const aiPlayers = [testAI, doesNothingAI, doesNothingAI, doesNothingAI];
			const { hands: playerHands, jacks } = copyHands(hands);
			firstPlayerHand = playerHands[0];
			const trumpCandidate = new Card(Suit.Spades, Rank.Nine);
			const bid = new Bid(done, playerHands, jacks, aiPlayers, Player.South, trumpCandidate);
			bid.doBidding();
		});
		it("Discarded the right card", () => {
			expect(firstPlayerHand.length).toBe(5);
			for (const card of firstPlayerHand) {
				expect(card.id).not.toBe(discard.id);
			}
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
		const aiPlayers = [doesNothingAI, doesNothingAI, doesNothingAI, doesNothingAI];
		const { hands: playerHands, jacks } = copyHands(hands);
		const trumpCandidate = new Card(Suit.Clubs, Rank.Nine);
		let bid: Bid;
		let bidResult: BidResult | null;
		beforeEach(function (done: DoneFn) {
			const callback = (result: BidResult | null) => {
				bidResult = result as BidResult;
				done();
			};
			bid = new Bid(callback, playerHands, jacks, aiPlayers, Player.East, trumpCandidate);
			bid.doBidding();
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
			const { hands: playerHands, jacks } = copyHands(hands);
			trumpCandidate = new Card(Suit.Spades, Rank.Nine);
			bid = new Bid(() => { return; }, playerHands, jacks, aiPlayers, Player.South, trumpCandidate);
		});

		it("Does not update the jacks before trump is called", function () {
			testAI = new IdiotAI();
			const orderUpSpy = spyOn(testAI, "chooseOrderUp").and.callThrough();
			const pickTrumpSpy = spyOn(testAI, "pickTrump").and.callThrough();
			aiPlayers[0] = testAI;
			bid.doBidding();

			expect(orderUpSpy.calls.count()).toBe(1);
			const [orderUpHand, orderUpTrumpCandidate] = orderUpSpy.calls.argsFor(0);
			for (const card of orderUpHand as Card[]) {
				expect(card.rank).toBeLessThanOrEqual(Rank.Ace);
			}
			expect((orderUpTrumpCandidate as Card).rank).toBeLessThanOrEqual(Rank.Ace);

			expect(pickTrumpSpy.calls.count()).toBe(1);
			const [pickTrumpHand, pickTrumpTrumpCandidate] = orderUpSpy.calls.argsFor(0);
			for (const card of pickTrumpHand as Card[]) {
				expect(card.rank).toBeLessThanOrEqual(Rank.Ace);
			}
			expect((pickTrumpTrumpCandidate as Card).rank).toBeLessThanOrEqual(Rank.Ace);
		});

		it("Updates the jacks after it is ordered up", function () {
			testAI = ordersItUpAI;
			const chooseGoAloneSpy = spyOn(testAI, "chooseGoAlone").and.callThrough();
			const pickDiscardSpy = spyOn(testAI, "pickDiscard").and.callThrough();
			aiPlayers[0] = testAI;
			bid.doBidding();

			expect(chooseGoAloneSpy.calls.count()).toBe(1);
			const [goAloneHand, goAloneSuit] = chooseGoAloneSpy.calls.argsFor(0);
			const rightId = new Card(goAloneSuit, Rank.Jack).id;
			const leftId = new Card(getOppositeSuit(goAloneSuit), Rank.Jack).id;
			for (const card of goAloneHand as Card[]) {
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
			const [discardHand] = chooseGoAloneSpy.calls.argsFor(0);
			for (const card of discardHand as Card[]) {
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
			const trump = Suit.Clubs;
			const rightId = new Card(trump, Rank.Jack).id;
			const leftId = new Card(getOppositeSuit(trump), Rank.Jack).id;
			const chooseGoAloneSpy = spyOn(testAI, "chooseGoAlone").and.callThrough();
			aiPlayers[0] = testAI;
			bid.doBidding();

			expect(chooseGoAloneSpy.calls.count()).toBe(1);
			const [hand] = chooseGoAloneSpy.calls.argsFor(0);
			for (const card of hand as Card[]) {
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
