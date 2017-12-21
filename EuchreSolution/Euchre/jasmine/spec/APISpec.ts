describe("API", function () {
	describe("getNextDealer", function () {
		let result;

		it("CURRENT PLAYER: south", function () {
			result = getNextDealer(Player.South);
			expect(result).toBe(Player.West);
		});

		it("CURRENT PLAYER: east", function () {
			result = getNextDealer(Player.East);
			expect(result).toBe(Player.South);
		});

		it("CURRENT PLAYER: north", function () {
			result = getNextDealer(Player.North);
			expect(result).toBe(Player.East);
		});

		it("CURRENT PLAYER: west", function () {
			result = getNextDealer(Player.West);
			expect(result).toBe(Player.North);
		});

		it("CURRENT PLAYER: no one", function () {
			result = getNextDealer();
			expect(result).toBeGreaterThan(-1);
			expect(result).toBeLessThan(4);
		});
	});

	describe("greaterCard", function () {
		let card1: Card;
		let card2: Card;
		const trickSuit = Suit.Spades;
		const trump = Suit.Hearts;

		it("FOLLOW SUIT: neither, TRUMP: neither", function () {
			card1 = new Card(Suit.Clubs, Rank.Nine);
			card2 = new Card(Suit.Clubs, Rank.Ten);
			expect(greaterCard(card1, card2, trickSuit, trump)).toBe(card2);
			expect(greaterCard(card2, card1, trickSuit, trump)).toBe(card2);
		});

		it("FOLLOW SUIT: both, TRUMP: neither", function () {
			card1 = new Card(Suit.Spades, Rank.Nine);
			card2 = new Card(Suit.Spades, Rank.Ten);
			expect(greaterCard(card1, card2, trickSuit, trump)).toBe(card2);
			expect(greaterCard(card2, card1, trickSuit, trump)).toBe(card2);
		});

		it("FOLLOW SUIT: neither, TRUMP: both", function () {
			card1 = new Card(Suit.Hearts, Rank.Nine);
			card2 = new Card(Suit.Hearts, Rank.Ten);
			expect(greaterCard(card1, card2, trickSuit, trump)).toBe(card2);
			expect(greaterCard(card2, card1, trickSuit, trump)).toBe(card2);
		});

		it("FOLLOW SUIT: 1, TRUMP: neither", function () {
			card1 = new Card(Suit.Spades, Rank.Nine);
			card2 = new Card(Suit.Clubs, Rank.Ten);
			expect(greaterCard(card1, card2, trickSuit, trump)).toBe(card1);
			expect(greaterCard(card2, card1, trickSuit, trump)).toBe(card1);
		});

		it("FOLLOW SUIT: 2, TRUMP: 1", function () {
			card1 = new Card(Suit.Hearts, Rank.Nine);
			card2 = new Card(Suit.Spades, Rank.Ten);
			expect(greaterCard(card1, card2, trickSuit, trump)).toBe(card1);
			expect(greaterCard(card2, card1, trickSuit, trump)).toBe(card1);
		});
	});

	describe("isValidPlay", function () {
		let hand: Card[];
		beforeEach(function () {
			hand = [
				new Card(Suit.Spades, Rank.Nine),
				new Card(Suit.Clubs, Rank.Ten),
				new Card(Suit.Spades, Rank.Jack),
				new Card(Suit.Spades, Rank.Queen),
				new Card(Suit.Spades, Rank.King),
			];
		});

		it("Empty hand", function () {
			expect(isValidPlay([], hand[0], Suit.Diamonds)).toBe(true);
			expect(isValidPlay([], hand[0], Suit.Spades)).toBe(true);
			expect(isValidPlay([], hand[0])).toBe(true);
		});
		it("has tricksuit, play tricksuit", function () {
			expect(isValidPlay(hand, hand[0], Suit.Spades)).toBe(true);
		});

		it("doesn't have tricksuit", function () {
			expect(isValidPlay(hand, hand[0], Suit.Diamonds)).toBe(true);
		});

		it("has tricksuit, plays invalid", function () {
			expect(isValidPlay(hand, hand[1], Suit.Spades)).toBe(false);
		});
		it("False-y trick suit", function () {
			expect(isValidPlay(hand, hand[0], Suit.Clubs)).toBe(false);
		});
	});

	describe("hasSuit", function () {
		const hand = [
			new Card(Suit.Spades, Rank.Nine),
			new Card(Suit.Spades, Rank.Ten),
			new Card(Suit.Spades, Rank.Jack),
			new Card(Suit.Spades, Rank.Queen),
			new Card(Suit.Spades, Rank.King),
		];

		it("has suit", function () {
			expect(hasSuit(hand, Suit.Spades)).toBe(true);
		});

		it("doesn't have suit", function () {
			expect(hasSuit(hand, Suit.Clubs)).toBe(false);
		});
	});

	describe("getBestCardPlayed", function () {
		let playedCards: PlayedCard[];
		const trump: Suit = Suit.Spades;
		let result: PlayedCard | null;

		it("no cards have been played", function () {
			expect(getBestCardPlayed([], trump)).toBeNull();
		});

		it("one card has been played", function () {
			playedCards = [{ player: Player.South, card: new Card(Suit.Hearts, Rank.Nine) }];
			result = getBestCardPlayed(playedCards, trump);
			expect(result).not.toBeNull();
			result = result as PlayedCard;
			expect(result.player).toBe(Player.South);
		});

		it("first player nails it, everyone follows suit", function () {
			playedCards = [
				{ player: Player.South, card: new Card(Suit.Hearts, Rank.Ace) },
				{ player: Player.West, card: new Card(Suit.Hearts, Rank.Nine) },
				{ player: Player.North, card: new Card(Suit.Hearts, Rank.Ten) },
				{ player: Player.East, card: new Card(Suit.Hearts, Rank.Jack) },
			];

			result = getBestCardPlayed(playedCards, trump);
			expect(result).not.toBeNull();
			result = result as PlayedCard;
			expect(result.player).toBe(Player.South);
		});

		it("no one can follow suit or trump", function () {
			playedCards = [
				{ player: Player.South, card: new Card(Suit.Hearts, Rank.Ace) },
				{ player: Player.West, card: new Card(Suit.Diamonds, Rank.Nine) },
				{ player: Player.North, card: new Card(Suit.Diamonds, Rank.Ten) },
				{ player: Player.East, card: new Card(Suit.Diamonds, Rank.Jack) },
			];

			result = getBestCardPlayed(playedCards, trump);
			expect(result).not.toBeNull();
			result = result as PlayedCard;
			expect(result.player).toBe(Player.South);
		});

		it("someone follows suit with higher card", function () {
			playedCards = [
				{ player: Player.South, card: new Card(Suit.Hearts, Rank.Nine) },
				{ player: Player.West, card: new Card(Suit.Hearts, Rank.Ten) },
				{ player: Player.North, card: new Card(Suit.Diamonds, Rank.Ace) },
				{ player: Player.East, card: new Card(Suit.Hearts, Rank.Ten) },
			];

			result = getBestCardPlayed(playedCards, trump);
			expect(result).not.toBeNull();
			result = result as PlayedCard;
			expect(result.player).toBe(Player.West);
		});

		it("someone trumps", function () {
			playedCards = [
				{ player: Player.South, card: new Card(Suit.Hearts, Rank.Ace) },
				{ player: Player.West, card: new Card(Suit.Spades, Rank.Nine) },
				{ player: Player.North, card: new Card(Suit.Hearts, Rank.Ten) },
				{ player: Player.East, card: new Card(Suit.Hearts, Rank.Jack) },
			];

			result = getBestCardPlayed(playedCards, trump);
			expect(result).not.toBeNull();
			result = result as PlayedCard;
			expect(result.player).toBe(Player.West);
		});

		it("someone overtrumps", function () {
			playedCards = [
				{ player: Player.South, card: new Card(Suit.Hearts, Rank.Ace) },
				{ player: Player.West, card: new Card(Suit.Spades, Rank.Nine) },
				{ player: Player.North, card: new Card(Suit.Spades, Rank.Ten) },
				{ player: Player.East, card: new Card(Suit.Hearts, Rank.Jack) },
			];

			result = getBestCardPlayed(playedCards, trump);
			expect(result).not.toBeNull();
			result = result as PlayedCard;
			expect(result.player).toBe(Player.North);
		});

		it("players play in different order", function () {
			playedCards = [
				{ player: Player.West, card: new Card(Suit.Hearts, Rank.Ace) },
				{ player: Player.North, card: new Card(Suit.Spades, Rank.Nine) },
				{ player: Player.East, card: new Card(Suit.Spades, Rank.Ten) },
				{ player: Player.South, card: new Card(Suit.Hearts, Rank.Jack) },
			];

			result = getBestCardPlayed(playedCards, trump);
			expect(result).not.toBeNull();
			result = result as PlayedCard;
			expect(result.player).toBe(Player.East);
		});
	});

	describe("getBestCardInHand", function () {
		let hand: Card[];
		let result: Card | null;

		it("empty hand", function () {
			hand = [];

			expect(getBestCardInHand(hand)).toBeNull();
		});

		it("single card", function () {
			hand = [new Card(Suit.Spades, Rank.Nine)];

			result = getBestCardInHand(hand);
			expect(result).not.toBeNull();
			result = result as Card;
			expect(result.id).toBe("Spades9");
		});

		it("all same suit hand", function () {
			hand = [
				new Card(Suit.Spades, Rank.Nine),
				new Card(Suit.Spades, Rank.Ten),
				new Card(Suit.Spades, Rank.Jack),
				new Card(Suit.Spades, Rank.Queen),
				new Card(Suit.Spades, Rank.King),
			];

			result = getBestCardInHand(hand);
			expect(result).not.toBeNull();
			result = result as Card;
			expect(result.id).toBe("Spades13");
		});

		it("one trump", function () {
			hand = [
				new Card(Suit.Diamonds, Rank.Nine),
				new Card(Suit.Spades, Rank.Ten),
				new Card(Suit.Spades, Rank.Jack),
				new Card(Suit.Spades, Rank.Queen),
				new Card(Suit.Spades, Rank.King),
			];

			result = getBestCardInHand(hand, undefined, Suit.Diamonds);
			expect(result).not.toBeNull();
			result = result as Card;
			expect(result.id).toBe("Diamonds9");
		});

		it("one card follows suit", function () {
			hand = [
				new Card(Suit.Spades, Rank.Nine),
				new Card(Suit.Hearts, Rank.Ten),
				new Card(Suit.Spades, Rank.Jack),
				new Card(Suit.Spades, Rank.Queen),
				new Card(Suit.Spades, Rank.King),
			];

			result = getBestCardInHand(hand, Suit.Hearts);
			expect(result).not.toBeNull();
			result = result as Card;
			expect(result.id).toBe("Hearts10");
		});

		it("can follow suit and has trump", function () {
			hand = [
				new Card(Suit.Diamonds, Rank.Nine),
				new Card(Suit.Hearts, Rank.Ten),
				new Card(Suit.Spades, Rank.Jack),
				new Card(Suit.Spades, Rank.Queen),
				new Card(Suit.Spades, Rank.King),
			];

			result = getBestCardInHand(hand, Suit.Hearts, Suit.Diamonds);
			expect(result).not.toBeNull();
			result = result as Card;
			expect(result.id).toBe("Diamonds9");
		});

		it("can't follow suit or trump", function () {
			hand = [
				new Card(Suit.Spades, Rank.Nine),
				new Card(Suit.Spades, Rank.Ten),
				new Card(Suit.Spades, Rank.Jack),
				new Card(Suit.Spades, Rank.Queen),
				new Card(Suit.Spades, Rank.King),
			];

			result = getBestCardInHand(hand, Suit.Hearts, Suit.Diamonds);
			expect(result).not.toBeNull();
			result = result as Card;
			expect(result.id).toBe("Spades13");
		});
	});

	describe("getWorstCardInHand", function () {
		it("Empty hand", function () {
			expect(getWorstCardInHand([])).toBeNull();
		});

		it("Single card", function () {
			const hand = [new Card(Suit.Spades, Rank.Nine)];
			let result = getWorstCardInHand(hand);
			expect(result).not.toBeNull();
			result = result as Card;
			expect(result).toEqual(new Card(Suit.Spades, Rank.Nine));
		});

		it("Two cards, same suit", function () {
			const hand = [
				new Card(Suit.Spades, Rank.Nine),
				new Card(Suit.Spades, Rank.Ten),
			];
			let result = getWorstCardInHand(hand);
			expect(result).not.toBeNull();
			result = result as Card;
			expect(result).toEqual(new Card(Suit.Spades, Rank.Nine));
		});

		it("Two cards, different suits", function () {
			const hand = [
				new Card(Suit.Spades, Rank.Nine),
				new Card(Suit.Clubs, Rank.Ten),
			];
			let result = getWorstCardInHand(hand, Suit.Spades);
			expect(result).not.toBeNull();
			result = result as Card;
			expect(result).toEqual(new Card(Suit.Clubs, Rank.Ten));
		});
	});

	describe("getCardValue", function () {
		let result: number;
		let card: Card;

		it("some card", function () {
			card = new Card(Suit.Spades, Rank.King);
			result = getCardValue(card);
			expect(result).toBe(13);
		});

		it("card that follows suit", function () {
			card = new Card(Suit.Spades, Rank.King);
			result = getCardValue(card, Suit.Spades);
			expect(result).toBe(113);
		});

		it("card that is trump", function () {
			card = new Card(Suit.Spades, Rank.King);
			result = getCardValue(card, undefined, Suit.Spades);
			expect(result).toBe(1013);
		});

		it("card that follows suit and is trump", function () {
			card = new Card(Suit.Spades, Rank.King);
			result = getCardValue(card, Suit.Spades, Suit.Spades);
			expect(result).toBe(1013);
		});
	});

	describe("isInHand", function () {
		const hand = [
			new Card(Suit.Hearts, Rank.Ace),
			new Card(Suit.Hearts, Rank.King),
			new Card(Suit.Diamonds, Rank.Ace),
			new Card(Suit.Diamonds, Rank.Queen),
			new Card(Suit.Spades, Rank.Jack),
			new Card(Suit.Clubs, Rank.Jack),
		];

		it("Handles the first card (same object)", function () {
			expect(isInHand(hand, hand[0])).toBe(true);
		});

		it("Handles the middle cards (same object)", function () {
			for (let i = 1; i < hand.length - 1; i++) {
				expect(isInHand(hand, hand[i])).toBe(true);
			}
		});

		it("Handles the last card (same object)", function () {
			expect(isInHand(hand, hand[hand.length - 1])).toBe(true);
		});

		it("Handles the first card (copy of object)", function () {
			const card = new Card(hand[0].suit, hand[0].rank);
			expect(isInHand(hand, card)).toBe(true);
		});

		it("Handles the middle cards (copy of object)", function () {
			for (let i = 1; i < hand.length - 1; i++) {
				const card = new Card(hand[i].suit, hand[i].rank);
				expect(isInHand(hand, card)).toBe(true);
			}
		});

		it("Handles the last card (copy of object)", function () {
			const card = new Card(hand[hand.length - 1].suit, hand[hand.length - 1].rank);
			expect(isInHand(hand, card)).toBe(true);
		});

		it("Doesn't find other cards", function () {
			expect(isInHand(hand, new Card(Suit.Spades, Rank.Ace))).toBe(false);
		});
	});

	describe("getTeam", function () {
		it("North", function () {
			expect(getTeam(Player.North)).toBe(Team.NorthSouth);
		});

		it("East", function () {
			expect(getTeam(Player.East)).toBe(Team.EastWest);
		});

		it("South", function () {
			expect(getTeam(Player.South)).toBe(Team.NorthSouth);
		});

		it("West", function () {
			expect(getTeam(Player.West)).toBe(Team.EastWest);
		});
	});

	describe("copyHand", function () {
		function testCopy(description: string, hand: Card[]) {
			it(description, function () {
				const result = copyHand(hand);
				expect(result.length).toBe(hand.length);
				for (let i = 0; i < result.length; i++) {
					expect(result[i]).toEqual(hand[i]);
					expect(result[i]).not.toBe(hand[i]);
				}
			});
		}

		testCopy(
			"empty hand",
			[],
		);

		testCopy(
			"single card",
			[new Card(Suit.Spades, Rank.Ace)],
		);

		testCopy(
			"full hand",
			[
				new Card(Suit.Spades, Rank.Jack),
				new Card(Suit.Clubs, Rank.Jack),
				new Card(Suit.Spades, Rank.Ace),
				new Card(Suit.Spades, Rank.King),
				new Card(Suit.Spades, Rank.Queen),
			],
		);

		testCopy(
			"keeps bowers as bowers",
			[
				new Card(Suit.Spades, Rank.Right),
				new Card(Suit.Spades, Rank.Left),
				new Card(Suit.Spades, Rank.Ace),
				new Card(Suit.Spades, Rank.King),
				new Card(Suit.Spades, Rank.Queen),
			],
		);
	});
});