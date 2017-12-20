function setupHand(doneCallback: DoneFn | (() => void) = () => { return; },
	dealer: Player = Player.South, shuffleResult?: ShuffleResult): {
		aiPlayers: EuchreAI[],
		hand: Hand,
		deck: Card[],
		jacks: Card[],
		playerHands: Card[][],
		trumpCandidate: Card,
	} {
	const aiPlayers = [new IdiotAI(), new IdiotAI(), new IdiotAI(), new IdiotAI()];
	const settings: Settings = {
		aiPlayers,
		enableDefendAlone: false,
		enableNoTrump: false,
		hasHooman: false,
		messageLevel: MessageLevel.Game,
		numGamesToPlay: 1,
		openHands: false,
		showTrickHistory: false,
		sound: false,
		statMode: true,
	};
	const hand = new Hand(doneCallback, dealer, aiPlayers, settings);
	if (!shuffleResult) {
		const jacks: Card[] = [];
		for (const suit of suitsArray) {
			jacks[suit] = new Card(suit, Rank.Jack);
		}
		const trumpCandidate = new Card(Suit.Spades, Rank.Ten);
		shuffleResult = {
			deck: [
				new Card(Suit.Clubs, Rank.Nine),
				new Card(Suit.Diamonds, Rank.Nine),
				new Card(Suit.Hearts, Rank.Nine),
				trumpCandidate,

				new Card(Suit.Spades, Rank.Queen),
				new Card(Suit.Spades, Rank.Nine),
				new Card(Suit.Hearts, Rank.Ten),
				new Card(Suit.Diamonds, Rank.Ten),

				new Card(Suit.Spades, Rank.King),
				new Card(Suit.Clubs, Rank.Ten),
				jacks[Suit.Hearts],
				new Card(Suit.Diamonds, Rank.Queen),

				new Card(Suit.Spades, Rank.Ace),
				new Card(Suit.Clubs, Rank.Queen),
				new Card(Suit.Hearts, Rank.Queen),
				new Card(Suit.Diamonds, Rank.King),

				jacks[Suit.Clubs],
				new Card(Suit.Clubs, Rank.King),
				new Card(Suit.Hearts, Rank.King),
				new Card(Suit.Diamonds, Rank.Ace),

				jacks[Suit.Spades],
				new Card(Suit.Clubs, Rank.Ace),
				new Card(Suit.Hearts, Rank.Ace),
				jacks[Suit.Diamonds],
			],
			jacks,
		};
	}
	spyOn(Hand, "getShuffledDeck").and.returnValue(shuffleResult);
	const playerHands = [[], [], [], []];
	Hand.dealHands(shuffleResult.deck.slice(), playerHands, dealer);
	return {
		aiPlayers,
		deck: shuffleResult.deck,
		hand,
		jacks: shuffleResult.jacks,
		playerHands,
		trumpCandidate: shuffleResult.deck[3],
	};
}

describe("HandSpec", function () {
	describe("Initial state", function () {
		let hand: Hand;

		beforeEach(() => {
			const { hand: playerHand } = setupHand();
			hand = playerHand;
		});

		it("handStage", function () {
			expect(hand.handStage()).toBe(HandStage.Dealing);
		});
		it("dealer", function () {
			expect(hand.dealer()).toBe(Player.South);
		});
		it("playerHands", function () {
			expect(hand.playerHands()).toBeUndefined();
		});
		it("trumpCandidate", function () {
			expect(hand.trumpCandidate()).toBeUndefined();
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
		let hand: Hand;
		let playerHands: Card[][];
		let trumpCandidate: Card;

		beforeEach(function (done: DoneFn) {
			const setup = setupHand(done);
			hand = setup.hand;
			playerHands = setup.playerHands;
			trumpCandidate = setup.trumpCandidate;
			hand.doHand();
		});

		it("handStage", function () {
			expect(hand.handStage()).toBe(HandStage.Finished);
		});
		it("dealer", function () {
			expect(hand.dealer()).toBe(Player.South);
		});
		it("playerHands", function () {
			expect(hand.playerHands()).toEqual(playerHands);
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
		let hand: Hand;
		let trumpCandidate: Card;
		let aiPlayers: EuchreAI[];

		beforeEach(function (done: DoneFn) {
			const setup = setupHand(done);
			hand = setup.hand;
			trumpCandidate = setup.trumpCandidate;
			aiPlayers = setup.aiPlayers;
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
			expect(hand.playerHands()).toEqual([[], [], [], []]);
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

	describe("Trick winner leads next", function () {
		let hand: Hand;
		let aiPlayers: EuchreAI[];

		beforeEach(function (done: DoneFn) {
			const setup = setupHand(done);
			hand = setup.hand;
			aiPlayers = setup.aiPlayers;
			spyOn(aiPlayers[0], "chooseOrderUp").and.returnValue(true);
			spyOn(aiPlayers[0], "pickCard").and.callThrough();
			hand.doHand();
		});
		it("Right player leads", function () {
			const calls = (aiPlayers[0].pickCard as jasmine.Spy).calls;
			expect(calls.argsFor(0)[3].length).toBe(3);
			expect(calls.argsFor(1)[3].length).toBe(0);
			expect(calls.argsFor(2)[3].length).toBe(0);
			expect(calls.argsFor(3)[3].length).toBe(0);
			expect(calls.argsFor(4)[3].length).toBe(0);
		});
	});

	describe("Actually play a hand (ordered up alone)", function () {
		let hand: Hand;
		let playerHands: Card[][];
		let trumpCandidate: Card;
		let aiPlayers: EuchreAI[];

		beforeEach(function (done: DoneFn) {
			const setup = setupHand(done);
			hand = setup.hand;
			playerHands = setup.playerHands;
			trumpCandidate = setup.trumpCandidate;
			aiPlayers = setup.aiPlayers;
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
			expect(hand.playerHands()).toEqual([[], [], playerHands[2], []]);
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
		let hand: Hand;
		let trumpCandidate: Card;
		let aiPlayers: EuchreAI[];

		beforeEach(function (done: DoneFn) {
			const setup = setupHand(done);
			hand = setup.hand;
			trumpCandidate = setup.trumpCandidate;
			aiPlayers = setup.aiPlayers;
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
			expect(hand.playerHands()).toEqual([[], [], [], []]);
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
		let hand: Hand;
		let playerHands: Card[][];
		let trumpCandidate: Card;
		let aiPlayers: EuchreAI[];

		beforeEach(function (done: DoneFn) {
			const setup = setupHand(done);
			hand = setup.hand;
			playerHands = setup.playerHands;
			trumpCandidate = setup.trumpCandidate;
			aiPlayers = setup.aiPlayers;
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
			expect(hand.playerHands()).toEqual([[], [], [], playerHands[3]]);
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
			const { deck: testDeck, jacks: testJacks } = Hand.getShuffledDeck();
			deck = testDeck;
			jacks = testJacks;
		});

		it("gets right size deck", function () {
			expect(deck.length).toBe(24);
		});

		it("only has each card once", function () {
			const index: { [key: string]: boolean } = {};
			for (const card of deck) {
				expect(index[card.id]).toBeUndefined();
				index[card.id] = true;
			}
		});

		it("has a copy of every card", function () {
			for (const card of SORTEDDECK) {
				let found = false;
				for (const deckCard of deck) {
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
			for (const card of deck) {
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
			const { deck } = Hand.getShuffledDeck();
			Hand.dealHands(deck, hands, Player.South);
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
		it("Took zero to two tricks", function () {
			for (let i = 0; i <= 2; i++) {
				expect(Hand.calculatePointGain(i, true, true, true)).toBe(0);
				expect(Hand.calculatePointGain(i, true, true, false)).toBe(0);
				expect(Hand.calculatePointGain(i, true, false, false)).toBe(0);
				expect(Hand.calculatePointGain(i, false, true, true)).toBe(0);
				expect(Hand.calculatePointGain(i, false, true, false)).toBe(0);
				expect(Hand.calculatePointGain(i, false, false, false)).toBe(0);
			}
		});

		it("Took three or four tricks", function () {
			for (let i = 3; i <= 4; i++) {
				expect(Hand.calculatePointGain(i, true, true, true)).toBe(1);
				expect(Hand.calculatePointGain(i, true, true, false)).toBe(1);
				expect(Hand.calculatePointGain(i, true, false, false)).toBe(1);
				expect(Hand.calculatePointGain(i, false, true, true)).toBe(4);
				expect(Hand.calculatePointGain(i, false, true, false)).toBe(2);
				expect(Hand.calculatePointGain(i, false, false, false)).toBe(2);
			}
		});

		it("Took five tricks", function () {
			expect(Hand.calculatePointGain(5, true, true, true)).toBe(4);
			expect(Hand.calculatePointGain(5, true, true, false)).toBe(4);
			expect(Hand.calculatePointGain(5, true, false, false)).toBe(2);
			expect(Hand.calculatePointGain(5, false, true, true)).toBe(4);
			expect(Hand.calculatePointGain(5, false, true, false)).toBe(2);
			expect(Hand.calculatePointGain(5, false, false, false)).toBe(2);
		});
	});

	describe("Check AI calls", function () {
		it("Calls init at the beginning", function () {
			const testAI = new IdiotAI();
			const initSpy = spyOn(testAI, "init");
			const aiPlayers = [testAI, testAI, testAI, testAI];
			const settings: Settings = {
				aiPlayers,
				enableDefendAlone: false,
				enableNoTrump: false,
				hasHooman: false,
				messageLevel: MessageLevel.Game,
				numGamesToPlay: 1,
				openHands: false,
				showTrickHistory: false,
				sound: false,
				statMode: true,
			};
			// tslint:disable-next-line:no-unused-expression
			new Hand(() => { return; }, Player.West, aiPlayers, settings);
			expect(initSpy.calls.count()).toBe(4);
			expect(initSpy.calls.argsFor(0)).toEqual([Player.North]);
			expect(initSpy.calls.argsFor(1)).toEqual([Player.East]);
			expect(initSpy.calls.argsFor(2)).toEqual([Player.South]);
			expect(initSpy.calls.argsFor(3)).toEqual([Player.West]);
		});
	});

	describe("Human players", function () {
		describe("Pauses for a human player", function () {
			let hand: Hand;
			let playerHands: Card[][];
			let trumpCandidate: Card;
			let aiPlayers: EuchreAI[];

			beforeEach((done: DoneFn) => {
				const jacks: Card[] = [];
				for (const suit of suitsArray) {
					jacks[suit] = new Card(suit, Rank.Jack);
				}
				const shuffleResult: ShuffleResult = {
					jacks,
					deck: [
						new Card(Suit.Clubs, Rank.Nine),
						new Card(Suit.Diamonds, Rank.Nine),
						new Card(Suit.Hearts, Rank.Nine),
						new Card(Suit.Spades, Rank.Ten),

						new Card(Suit.Spades, Rank.Queen),
						new Card(Suit.Spades, Rank.Nine),
						new Card(Suit.Hearts, Rank.Ten),
						new Card(Suit.Diamonds, Rank.Ten),

						new Card(Suit.Clubs, Rank.Ten),
						jacks[Suit.Hearts],
						new Card(Suit.Spades, Rank.King),
						new Card(Suit.Diamonds, Rank.Queen),

						new Card(Suit.Clubs, Rank.Queen),
						new Card(Suit.Hearts, Rank.Queen),
						new Card(Suit.Diamonds, Rank.King),
						new Card(Suit.Spades, Rank.Ace),

						jacks[Suit.Clubs],
						new Card(Suit.Clubs, Rank.King),
						new Card(Suit.Hearts, Rank.King),
						new Card(Suit.Diamonds, Rank.Ace),

						jacks[Suit.Spades],
						new Card(Suit.Clubs, Rank.Ace),
						new Card(Suit.Hearts, Rank.Ace),
						jacks[Suit.Diamonds],
					],
				};
				const setup = setupHand(undefined, Player.North, shuffleResult);
				trumpCandidate = setup.trumpCandidate;
				playerHands = setup.playerHands;
				playerHands[Player.North].push(trumpCandidate);
				playerHands[Player.North].splice(0, 1);
				playerHands[Player.East].splice(0, 1);
				aiPlayers = setup.aiPlayers;
				const mixedPlayers: Settings["aiPlayers"] = aiPlayers.slice();
				mixedPlayers[0] = null;
				const settings: Settings = {
					aiPlayers: mixedPlayers,
					enableDefendAlone: false,
					enableNoTrump: false,
					hasHooman: true,
					messageLevel: MessageLevel.Game,
					numGamesToPlay: 1,
					openHands: false,
					showTrickHistory: false,
					sound: false,
					statMode: true,
				};
				spyOn(mixedPlayers[3], "chooseOrderUp").and.returnValue(true);
				hand = new Hand(() => { return; }, Player.North, mixedPlayers, settings);
				hand.doHand();
				setInterval(() => {
					if (pausedForHuman) {
						done();
					}
				}, 1);
			});

			afterEach(function () {
				pausedForHuman = false;
			});

			it("handStage", function () {
				expect(hand.handStage()).toBe(HandStage.Playing);
			});
			it("dealer", function () {
				expect(hand.dealer()).toBe(Player.North);
			});
			it("playerHands", function () {
				expect(hand.playerHands()).toEqual(playerHands);
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
	});
});
