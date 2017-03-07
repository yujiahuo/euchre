describe("HandSpec", function () {
	let hand: Hand;
	let playerHands: Card[][];
	let trumpCandidate: Card;
	let bid: Bid;

	beforeEach(function () {
		let dealer = Player.South;
		let aiPlayers = [new IdiotAI(), new IdiotAI(), new IdiotAI(), new IdiotAI()];
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
		(hand as any).__jacks = jacks;
		trumpCandidate = new Card(Suit.Spades, Rank.Ten);
		(hand as any).__trumpCandidate = trumpCandidate;
		bid = new Bid(playerHands, aiPlayers, Player.South, trumpCandidate);
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
		it("numPlayers", function () {
			expect(hand.numPlayers()).toBe(4);
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
			spyOn(bid, "doBidding").and.returnValue(null);
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
		it("numPlayers", function () {
			expect(hand.numPlayers()).toBe(4);
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
			spyOn(bid, "doBidding").and.returnValue({
				trump: trumpCandidate.suit,
				maker: Player.South,
				alone: false,
				stage: BidStage.Round1,
			});
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
		it("numPlayers", function () {
			expect(hand.numPlayers()).toBe(4);
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
			spyOn(bid, "doBidding").and.returnValue({
				trump: trumpCandidate.suit,
				maker: Player.South,
				alone: true,
				stage: BidStage.Round1,
			});
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
		it("numPlayers", function () {
			expect(hand.numPlayers()).toBe(3);
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
			spyOn(bid, "doBidding").and.returnValue({
				trump: Suit.Diamonds,
				maker: Player.West,
				alone: false,
				stage: BidStage.Round2,
			});
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
		it("numPlayers", function () {
			expect(hand.numPlayers()).toBe(4);
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
			spyOn(bid, "doBidding").and.returnValue({
				trump: Suit.Diamonds,
				maker: Player.West,
				alone: true,
				stage: BidStage.Round2,
			});
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
		it("numPlayers", function () {
			expect(hand.numPlayers()).toBe(3);
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
			let {deck} = getShuffledDeck();
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
});