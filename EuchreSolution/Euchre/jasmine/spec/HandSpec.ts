describe("HandSpec", function () {
	let hand: Hand;
	let aiPlayers: EuchreAI[];
	let playerHands: Card[][];
	let trumpCandidate: Card;
	let bid: Bid;

	beforeEach(function () {
		let dealer = Player.South;
		aiPlayers = [new IdiotAI(), new IdiotAI(), new IdiotAI(), new IdiotAI()];
		hand = new Hand(dealer, aiPlayers);
		playerHands = [
			[
				new Card(Suit.Spades, Rank.Jack),
				new Card(Suit.Clubs, Rank.Jack),
				new Card(Suit.Spades, Rank.Ace),
				new Card(Suit.Spades, Rank.King),
				new Card(Suit.Spades, Rank.Queen),
			],
			[
				new Card(Suit.Diamonds, Rank.Jack),
				new Card(Suit.Diamonds, Rank.Ace),
				new Card(Suit.Diamonds, Rank.King),
				new Card(Suit.Diamonds, Rank.Queen),
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
				new Card(Suit.Spades, Rank.Nine),
			],
		];
		(hand as any).__playerHands = playerHands;
		let jacks = [
			playerHands[0][1],
			playerHands[1][0],
			playerHands[2][4],
			playerHands[0][0],
		];
		trumpCandidate = new Card(Suit.Spades, Rank.Ten);
		(hand as any).__trumpCandidate = trumpCandidate;
		bid = new Bid(playerHands, jacks, aiPlayers, Player.South, trumpCandidate);
		(hand as any).__bid = bid;
	});

	describe("Initial state", function () {
		it("handStage", function () {
			expect(hand.handStage()).toBe(HandStage.Bidding);
		});
		it("dealer", function () {
			expect(hand.dealer()).toBe(Player.South);
		});
		it("playerHands", function () {
			expect(hand.playerHands()).toBe(playerHands);
		});
		it("trumpCandidate", function () {
			expect(hand.trumpCandidate()).toBe(trumpCandidate);
		});
		it("numTricksPlayed", function () {
			expect(hand.numTricksPlayed()).toBe(0);
		});
		it("nsTricksWon", function () {
			expect(hand.nsTricksWon()).toBe(0);
		});
		it("ewTricksWon", function () {
			expect(hand.ewTricksWon()).toBe(0);
		});
		it("nsPointsWon", function () {
			expect(hand.nsPointsWon()).toBe(0);
		});
		it("ewPointsWon", function () {
			expect(hand.ewPointsWon()).toBe(0);
		});
		it("isFinished", function () {
			expect(hand.isFinished()).toBe(false);
		});
	});

	describe("No one bids", function () {
		beforeEach(function () {
			hand.doHand();
		});
		it("handStage", function () {
			expect(hand.handStage()).toBe(HandStage.Finished);
		});
		it("dealer", function () {
			expect(hand.dealer()).toBe(Player.South);
		});
		it("playerHands", function () {
			expect(hand.playerHands()).toBe(playerHands);
		});
		it("trumpCandidate", function () {
			expect(hand.trumpCandidate()).toBe(trumpCandidate);
		});
		it("numTricksPlayed", function () {
			expect(hand.numTricksPlayed()).toBe(0);
		});
		it("nsTricksWon", function () {
			expect(hand.nsTricksWon()).toBe(0);
		});
		it("ewTricksWon", function () {
			expect(hand.ewTricksWon()).toBe(0);
		});
		it("nsPointsWon", function () {
			expect(hand.nsPointsWon()).toBe(0);
		});
		it("ewPointsWon", function () {
			expect(hand.ewPointsWon()).toBe(0);
		});
		it("isFinished", function () {
			expect(hand.isFinished()).toBe(true);
		});
	});

	describe("Actually play a hand (ordered up)", function () {
		beforeEach(function () {
			spyOn(aiPlayers[0], "chooseOrderUp").and.returnValue(true);
			hand.doHand();
		});
		it("handStage", function () {
			expect(hand.handStage()).toBe(HandStage.Finished);
		});
		it("dealer", function () {
			expect(hand.dealer()).toBe(Player.South);
		});
		it("playerHands", function () {
			expect(hand.playerHands()).toBe(playerHands);
		});
		it("trumpCandidate", function () {
			expect(hand.trumpCandidate()).toBe(trumpCandidate);
		});
		it("numTricksPlayed", function () {
			expect(hand.numTricksPlayed()).toBe(5);
		});
		it("nsTricksWon", function () {
			expect(hand.nsTricksWon()).toBe(5);
		});
		it("ewTricksWon", function () {
			expect(hand.ewTricksWon()).toBe(0);
		});
		it("nsPointsWon", function () {
			expect(hand.nsPointsWon()).toBe(2);
		});
		it("ewPointsWon", function () {
			expect(hand.ewPointsWon()).toBe(0);
		});
		it("isFinished", function () {
			expect(hand.isFinished()).toBe(true);
		});
	});

	describe("Actually play a hand (ordered up alone)", function () {
		beforeEach(function () {
			spyOn(aiPlayers[0], "chooseOrderUp").and.returnValue(true);
			spyOn(aiPlayers[0], "chooseGoAlone").and.returnValue(true);
			hand.doHand();
		});
		it("handStage", function () {
			expect(hand.handStage()).toBe(HandStage.Finished);
		});
		it("dealer", function () {
			expect(hand.dealer()).toBe(Player.South);
		});
		it("playerHands", function () {
			expect(hand.playerHands()).toBe(playerHands);
		});
		it("trumpCandidate", function () {
			expect(hand.trumpCandidate()).toBe(trumpCandidate);
		});
		it("numTricksPlayed", function () {
			expect(hand.numTricksPlayed()).toBe(5);
		});
		it("nsTricksWon", function () {
			expect(hand.nsTricksWon()).toBe(5);
		});
		it("ewTricksWon", function () {
			expect(hand.ewTricksWon()).toBe(0);
		});
		it("nsPointsWon", function () {
			expect(hand.nsPointsWon()).toBe(4);
		});
		it("ewPointsWon", function () {
			expect(hand.ewPointsWon()).toBe(0);
		});
		it("isFinished", function () {
			expect(hand.isFinished()).toBe(true);
		});
	});

	describe("Actually play a hand (called)", function () {
		beforeEach(function () {
			spyOn(aiPlayers[1], "pickTrump").and.returnValue(Suit.Diamonds);
			hand.doHand();
		});
		it("handStage", function () {
			expect(hand.handStage()).toBe(HandStage.Finished);
		});
		it("dealer", function () {
			expect(hand.dealer()).toBe(Player.South);
		});
		it("playerHands", function () {
			expect(hand.playerHands()).toBe(playerHands);
		});
		it("trumpCandidate", function () {
			expect(hand.trumpCandidate()).toBe(trumpCandidate);
		});
		it("numTricksPlayed", function () {
			expect(hand.numTricksPlayed()).toBe(5);
		});
		it("nsTricksWon", function () {
			expect(hand.nsTricksWon()).toBe(0);
		});
		it("ewTricksWon", function () {
			expect(hand.ewTricksWon()).toBe(5);
		});
		it("nsPointsWon", function () {
			expect(hand.nsPointsWon()).toBe(0);
		});
		it("ewPointsWon", function () {
			expect(hand.ewPointsWon()).toBe(2);
		});
		it("isFinished", function () {
			expect(hand.isFinished()).toBe(true);
		});
	});

	describe("Actually play a hand (called alone)", function () {
		beforeEach(function () {
			spyOn(aiPlayers[1], "pickTrump").and.returnValue(Suit.Diamonds);
			spyOn(aiPlayers[1], "chooseGoAlone").and.returnValue(true);
			hand.doHand();
		});
		it("handStage", function () {
			expect(hand.handStage()).toBe(HandStage.Finished);
		});
		it("dealer", function () {
			expect(hand.dealer()).toBe(Player.South);
		});
		it("playerHands", function () {
			expect(hand.playerHands()).toBe(playerHands);
		});
		it("trumpCandidate", function () {
			expect(hand.trumpCandidate()).toBe(trumpCandidate);
		});
		it("numTricksPlayed", function () {
			expect(hand.numTricksPlayed()).toBe(5);
		});
		it("nsTricksWon", function () {
			expect(hand.nsTricksWon()).toBe(0);
		});
		it("ewTricksWon", function () {
			expect(hand.ewTricksWon()).toBe(5);
		});
		it("nsPointsWon", function () {
			expect(hand.nsPointsWon()).toBe(0);
		});
		it("ewPointsWon", function () {
			expect(hand.ewPointsWon()).toBe(4);
		});
		it("isFinished", function () {
			expect(hand.isFinished()).toBe(true);
		});
	});

	describe("getShuffledDeck", function () {
		let deck: Card[];
		let jacks: Card[];

		beforeEach(function () {
			let { deck: testDeck, jacks: testJacks } = getShuffledDeck();
			deck = testDeck;
			jacks = testJacks;
		});

		it("gets right size deck", function () {
			expect(deck.length).toBe(24);
		});

		it("only has each card once", function () {
			let index: { [key: string]: boolean } = {};
			for (let card of deck) {
				expect(index[card.id]).toBe(undefined);
				index[card.id] = true;
			}
		});

		it("has a copy of every card", function () {
			for (let card of SORTEDDECK) {
				let found = false;
				for (let deckCard of deck) {
					if (card.id === deckCard.id) {
						expect(deckCard).toEqual(card);
						expect(deckCard).not.toBe(card);
						found = true;
						break;
					}
				}
				expect(found).toBe(true, "Missing card: " + card.id);
			}
		});

		it("builds jacks correctly", function () {
			for (let card of deck) {
				if (card.rank === Rank.Jack) {
					expect(jacks[card.suit]).toBe(card);
				}
			}
		});
	});

	describe("dealHands", function () {
		let hands: Card[][];

		beforeEach(function () {
			hands = [[], [], [], []];
			let { deck } = getShuffledDeck();
			dealHands(deck, hands, Player.South);
		});

		it("deals hands out", function () {
			expect(hands.length).toBe(4);
			for (let i = 0; i < 4; i++) {
				expect(hands[i].length).toBe(5);
				for (let j = 0; j < 5; j++) {
					expect(hands[i][j]).not.toBeNull();
					expect(hands[i][j]).not.toBeUndefined();
				}
			}
		});
	});

	describe("calculatePointGain", function () {
		it("Took no tricks", function () {
			expect(calculatePointGain(0, true, true, true)).toBe(0);
			expect(calculatePointGain(0, true, true, false)).toBe(0);
			expect(calculatePointGain(0, true, false, false)).toBe(0);
			expect(calculatePointGain(0, false, true, true)).toBe(0);
			expect(calculatePointGain(0, false, true, false)).toBe(0);
			expect(calculatePointGain(0, false, false, false)).toBe(0);
		});

		it("Took one trick", function () {
			expect(calculatePointGain(1, true, true, true)).toBe(0);
			expect(calculatePointGain(1, true, true, false)).toBe(0);
			expect(calculatePointGain(1, true, false, false)).toBe(0);
			expect(calculatePointGain(1, false, true, true)).toBe(0);
			expect(calculatePointGain(1, false, true, false)).toBe(0);
			expect(calculatePointGain(1, false, false, false)).toBe(0);
		});

		it("Took two tricks", function () {
			expect(calculatePointGain(2, true, true, true)).toBe(0);
			expect(calculatePointGain(2, true, true, false)).toBe(0);
			expect(calculatePointGain(2, true, false, false)).toBe(0);
			expect(calculatePointGain(2, false, true, true)).toBe(0);
			expect(calculatePointGain(2, false, true, false)).toBe(0);
			expect(calculatePointGain(2, false, false, false)).toBe(0);
		});

		it("Took three tricks", function () {
			expect(calculatePointGain(3, true, true, true)).toBe(1);
			expect(calculatePointGain(3, true, true, false)).toBe(1);
			expect(calculatePointGain(3, true, false, false)).toBe(1);
			expect(calculatePointGain(3, false, true, true)).toBe(4);
			expect(calculatePointGain(3, false, true, false)).toBe(2);
			expect(calculatePointGain(3, false, false, false)).toBe(2);
		});

		it("Took four tricks", function () {
			expect(calculatePointGain(4, true, true, true)).toBe(1);
			expect(calculatePointGain(4, true, true, false)).toBe(1);
			expect(calculatePointGain(4, true, false, false)).toBe(1);
			expect(calculatePointGain(4, false, true, true)).toBe(4);
			expect(calculatePointGain(4, false, true, false)).toBe(2);
			expect(calculatePointGain(4, false, false, false)).toBe(2);
		});

		it("Took five tricks", function () {
			expect(calculatePointGain(5, true, true, true)).toBe(4);
			expect(calculatePointGain(5, true, true, false)).toBe(4);
			expect(calculatePointGain(5, true, false, false)).toBe(2);
			expect(calculatePointGain(5, false, true, true)).toBe(4);
			expect(calculatePointGain(5, false, true, false)).toBe(2);
			expect(calculatePointGain(5, false, false, false)).toBe(2);
		});
	});

	describe("Check AI calls", function () {
		it("Calls init at the beginning", function () {
			let testAI = new IdiotAI();
			let initSpy = spyOn(testAI, "init");
			aiPlayers = [testAI, testAI, testAI, testAI];
			//tslint:disable-next-line:no-unused-new
			new Hand(Player.West, aiPlayers);
			expect(initSpy.calls.count()).toBe(4);
			expect(initSpy.calls.argsFor(0)).toEqual([Player.North]);
			expect(initSpy.calls.argsFor(1)).toEqual([Player.East]);
			expect(initSpy.calls.argsFor(2)).toEqual([Player.South]);
			expect(initSpy.calls.argsFor(3)).toEqual([Player.West]);
		});
	});
});