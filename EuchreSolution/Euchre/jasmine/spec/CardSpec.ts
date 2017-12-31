describe("Card", function () {
	describe("constructor", function () {
		it("Correctly builds the right", function () {
			const card = new Card(Suit.Spades, Rank.Right);
			expect(card.id).toBe("Spades11");
		});

		it("Correctly builds the left", function () {
			const card = new Card(Suit.Spades, Rank.Left);
			expect(card.id).toBe("Clubs11");
		});

		it("Correctly builds non-bower jacks", function () {
			const card = new Card(Suit.Spades, Rank.Jack);
			expect(card.id).toBe("Spades11");
		});

		it("Correctly builds other cards", function () {
			let card = new Card(Suit.Spades, Rank.Nine);
			expect(card.id).toBe("Spades9");
			card = new Card(Suit.Spades, Rank.Ace);
			expect(card.id).toBe("Spades14");
		});
	});

	describe("safeCard", function () {
		it("Correctly handles nulls", function () {
			expect(Card.safeCard(null)).toBeNull();
		});

		it("Correctly copies the right", function () {
			const card = Card.safeCard(new Card(Suit.Hearts, Rank.Right));
			expect(card.suit).toBe(Suit.Hearts);
			expect(card.rank).toBe(Rank.Right);
			expect(card.id).toBe("Hearts11");
		});

		it("Correctly copies the left", function () {
			const card = Card.safeCard(new Card(Suit.Hearts, Rank.Left));
			expect(card.suit).toBe(Suit.Hearts);
			expect(card.rank).toBe(Rank.Left);
			expect(card.id).toBe("Diamonds11");
		});

		it("Correctly copies non-bower jacks", function () {
			const card = Card.safeCard(new Card(Suit.Hearts, Rank.Jack));
			expect(card.suit).toBe(Suit.Hearts);
			expect(card.rank).toBe(Rank.Jack);
			expect(card.id).toBe("Hearts11");
		});

		it("Correctly copies other cards", function () {
			let card = Card.safeCard(new Card(Suit.Spades, Rank.Nine));
			expect(card.suit).toBe(Suit.Spades);
			expect(card.rank).toBe(Rank.Nine);
			expect(card.id).toBe("Spades9");
			card = new Card(Suit.Spades, Rank.Ace);
			expect(card.suit).toBe(Suit.Spades);
			expect(card.rank).toBe(Rank.Ace);
			expect(card.id).toBe("Spades14");
		});
	});
});