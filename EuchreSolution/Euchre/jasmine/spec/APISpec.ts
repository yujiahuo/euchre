/// <reference path="../../Scripts/typings/jasmine/jasmine.d.ts" />
/// <reference path="../../GameScript/globs.ts" />
/// <reference path="../../GameScript/utils.ts" />
/// <reference path="../../GameScript/playerAPI.ts" />
/// <reference path="../../GameScript/trick.ts" />
/// <reference path="../../GameScript/hand.ts" />
/// <reference path="../../GameScript/game.ts" />
/// <reference path="../../GameScript/animation.ts" />
/// <reference path="../../AIScript/decentAI.ts" />
/// <reference path="../../AIScript/idiotAI.ts" />

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

	it("CURRENT PLAYER: no one", function () {
		result = getNextDealer();
		expect(result).toBeGreaterThan(-1);
		expect(result).toBeLessThan(4);
	});
});

describe("getShuffledDeck", function () {
	let result = getShuffledDeck();

	it("gets right size deck", function () {
		expect(result.length).toBe(24);
	});

});

describe("dealHands", function () {
	let deck;
	let hands = new Array(4);
	for (let i = 0; i < 4; i++) {
		hands[i] = new Array(5);
	}

	deck = getShuffledDeck();
	dealHands(deck, hands, 0);

	it("deals hands out", function () {
		for (let i = 0; i < 4; i++) {
			for (let j = 0; j < 5; j++) {
				expect(hands[i][j]).not.toBe(null);
			}
		}
	});
});

describe("greaterCard", function () {
	let card1;
	let card2;
	let trickSuit = Suit.Spades;
	let trump = Suit.Hearts;

	it("FOLLOW SUIT: neither, TRUMP: neither", function () {
		card1 = new Card(Suit.Clubs, Rank.Nine);
		card2 = new Card(Suit.Clubs, Rank.Ten);
		expect(greaterCard(card1, card2, trickSuit, trump)).toBe(card2);
	});

	it("FOLLOW SUIT: both, TRUMP: neither", function () {
		card1 = new Card(Suit.Spades, Rank.Nine);
		card2 = new Card(Suit.Spades, Rank.Ten);
		expect(greaterCard(card1, card2, trickSuit, trump)).toBe(card2);
	});

	it("FOLLOW SUIT: neither, TRUMP: both", function () {
		card1 = new Card(Suit.Hearts, Rank.Nine);
		card2 = new Card(Suit.Hearts, Rank.Ten);
		expect(greaterCard(card1, card2, trickSuit, trump)).toBe(card2);
	});

	it("FOLLOW SUIT: 1, TRUMP: neither", function () {
		card1 = new Card(Suit.Spades, Rank.Nine);
		card2 = new Card(Suit.Clubs, Rank.Ten);
		expect(greaterCard(card1, card2, trickSuit, trump)).toBe(card1);
	});

	it("FOLLOW SUIT: 2, TRUMP: 1", function () {
		card1 = new Card(Suit.Hearts, Rank.Nine);
		card2 = new Card(Suit.Spades, Rank.Ten);
		expect(greaterCard(card1, card2, trickSuit, trump)).toBe(card1);
	});
});

describe("isValidPlay", function () {
	let hand = [
		new Card(Suit.Spades, Rank.Nine),
		new Card(Suit.Hearts, Rank.Ten),
		new Card(Suit.Spades, Rank.Jack),
		new Card(Suit.Spades, Rank.Queen),
		new Card(Suit.Spades, Rank.King),
	];

	it("has tricksuit, play tricksuit", function () {
		expect(isValidPlay(hand, hand[0], Suit.Spades)).toBe(true);
	});

	it("doesn't have tricksuit", function () {
		expect(isValidPlay(hand, hand[0], Suit.Clubs)).toBe(true);
	});

	it("has tricksuit, plays invalid", function () {
		expect(isValidPlay(hand, hand[1], Suit.Spades)).toBe(false);
	});
});

describe("hasSuit", function () {
	let hand = [
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
	let playedCards: PlayedCard[]
	let trump: Suit = Suit.Spades
	let result: PlayedCard | null;

	it("first player nails it, everyone follows suit", function () {
		playedCards = [];
		playedCards.push({ player: Player.South, card: new Card(Suit.Hearts, Rank.Ace) });
		playedCards.push({ player: Player.West, card: new Card(Suit.Hearts, Rank.Nine) });
		playedCards.push({ player: Player.North, card: new Card(Suit.Hearts, Rank.Ten) });
		playedCards.push({ player: Player.East, card: new Card(Suit.Hearts, Rank.Jack) });

		result = getBestCardPlayed(playedCards, trump);
		expect(result).toBeDefined();
		if (result) {
			expect(result.player).toBe(Player.South);
		}
	});

	it("no one can follow suit or trump", function () {
		playedCards = [];
		playedCards.push({ player: Player.South, card: new Card(Suit.Hearts, Rank.Ace) });
		playedCards.push({ player: Player.West, card: new Card(Suit.Diamonds, Rank.Nine) });
		playedCards.push({ player: Player.North, card: new Card(Suit.Diamonds, Rank.Ten) });
		playedCards.push({ player: Player.East, card: new Card(Suit.Diamonds, Rank.Jack) });

		result = getBestCardPlayed(playedCards, trump);
		expect(result).toBeDefined();
		if (result) {
			expect(result.player).toBe(Player.South);
		}
	});

	it("someone follows suit with higher card", function () {
		playedCards = [];
		playedCards.push({ player: Player.South, card: new Card(Suit.Hearts, Rank.Nine) });
		playedCards.push({ player: Player.West, card: new Card(Suit.Hearts, Rank.Ten) });
		playedCards.push({ player: Player.North, card: new Card(Suit.Diamonds, Rank.Ace) });
		playedCards.push({ player: Player.East, card: new Card(Suit.Hearts, Rank.Ten) });

		result = getBestCardPlayed(playedCards, trump);
		expect(result).toBeDefined();
		if (result) {
			expect(result.player).toBe(Player.West);
		}
	});

	it("someone trumps", function () {
		playedCards = [];
		playedCards.push({ player: Player.South, card: new Card(Suit.Hearts, Rank.Ace) });
		playedCards.push({ player: Player.West, card: new Card(Suit.Spades, Rank.Nine) });
		playedCards.push({ player: Player.North, card: new Card(Suit.Hearts, Rank.Ten) });
		playedCards.push({ player: Player.East, card: new Card(Suit.Hearts, Rank.Jack) });

		result = getBestCardPlayed(playedCards, trump);
		expect(result).toBeDefined();
		if (result) {
			expect(result.player).toBe(Player.West);
		}
	});

	it("someone overtrumps", function () {
		playedCards = [];
		playedCards.push({ player: Player.South, card: new Card(Suit.Hearts, Rank.Ace) });
		playedCards.push({ player: Player.West, card: new Card(Suit.Spades, Rank.Nine) });
		playedCards.push({ player: Player.North, card: new Card(Suit.Spades, Rank.Ten) });
		playedCards.push({ player: Player.East, card: new Card(Suit.Hearts, Rank.Jack) });

		result = getBestCardPlayed(playedCards, trump);
		expect(result).toBeDefined();
		if (result) {
			expect(result.player).toBe(Player.North);
		}
	});

	it("players play in different order", function () {
		playedCards = [];
		playedCards.push({ player: Player.West, card: new Card(Suit.Hearts, Rank.Ace) });
		playedCards.push({ player: Player.North, card: new Card(Suit.Spades, Rank.Nine) });
		playedCards.push({ player: Player.East, card: new Card(Suit.Spades, Rank.Ten) });
		playedCards.push({ player: Player.South, card: new Card(Suit.Hearts, Rank.Jack) });

		result = getBestCardPlayed(playedCards, trump);
		expect(result).toBeDefined();
		if (result) {
			expect(result.player).toBe(Player.East);
		}
	});

});

describe("getBestCardInHand", function () {
	let hand: Card[];
	let result: Card | null;

	it("all same suit hand", function () {
		hand = [
			new Card(Suit.Spades, Rank.Nine),
			new Card(Suit.Spades, Rank.Ten),
			new Card(Suit.Spades, Rank.Jack),
			new Card(Suit.Spades, Rank.Queen),
			new Card(Suit.Spades, Rank.King),
		];

		result = getBestCardInHand(hand);
		expect(result).toBeDefined();
		if (result) {
			expect(result.id).toBe("Spades13");
		}
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
		expect(result).toBeDefined();
		if (result) {
			expect(result.id).toBe("Diamonds9");
		}
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
		expect(result).toBeDefined();
		if (result) {
			expect(result.id).toBe("Hearts10");
		}
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
		expect(result).toBeDefined();
		if (result) {
			expect(result.id).toBe("Diamonds9");
		}
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
		expect(result).toBeDefined();
		if (result) {
			expect(result.id).toBe("Spades13");
		}
	});
});

describe("getCardValue", function () {
	let result: number;
	let card: Card;

	it("some card", function () {
		card = new Card(Suit.Spades, Rank.King)
		result = getCardValue(card);
		expect(result).toBe(13);
	});

	it("card that follows suit", function () {
		card = new Card(Suit.Spades, Rank.King)
		result = getCardValue(card, Suit.Spades);
		expect(result).toBe(113);
	});

	it("card that is trump", function () {
		card = new Card(Suit.Spades, Rank.King)
		result = getCardValue(card, undefined, Suit.Spades);
		expect(result).toBe(1013);
	});

	it("card that follows suit and is trump", function () {
		card = new Card(Suit.Spades, Rank.King)
		result = getCardValue(card, Suit.Spades, Suit.Spades);
		expect(result).toBe(1013);
	});
});

describe("canOrderUpSuit", function () {
	it("doesstuff", function () {
	});
});

describe("isInHand", function () {
	let hand = [
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
		let card = new Card(hand[0].suit, hand[0].rank)
		expect(isInHand(hand, card)).toBe(true);
	});

	it("Handles the middle cards (copy of object)", function () {
		for (let i = 1; i < hand.length - 1; i++) {
			let card = new Card(hand[i].suit, hand[i].rank)
			expect(isInHand(hand, card)).toBe(true);
		}
	});

	it("Handles the last card (copy of object)", function () {
		let card = new Card(hand[hand.length - 1].suit, hand[hand.length - 1].rank)
		expect(isInHand(hand, card)).toBe(true);
	});

	it("Doesn't find other cards", function () {
		expect(isInHand(hand, new Card(Suit.Spades, Rank.Ace))).toBe(false);
	});
});
