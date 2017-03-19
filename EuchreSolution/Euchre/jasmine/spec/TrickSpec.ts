describe("Trick", function () {
	let trick: TestTrick;
	let aiPlayers: IdiotAI[];
	let hands: Card[][];

	beforeEach(function () {
		hands = [
			[
				new Card(Suit.Spades, Rank.Right),
				new Card(Suit.Spades, Rank.Left),
				new Card(Suit.Spades, Rank.Ace),
				new Card(Suit.Spades, Rank.King),
				new Card(Suit.Spades, Rank.Queen),
			],
			[
				new Card(Suit.Diamonds, Rank.Ace),
				new Card(Suit.Diamonds, Rank.King),
				new Card(Suit.Diamonds, Rank.Queen),
				new Card(Suit.Diamonds, Rank.Ten),
				new Card(Suit.Diamonds, Rank.Nine),
			],
			[
				new Card(Suit.Hearts, Rank.Jack),
				new Card(Suit.Diamonds, Rank.Jack),
				new Card(Suit.Hearts, Rank.Ace),
				new Card(Suit.Hearts, Rank.King),
				new Card(Suit.Hearts, Rank.Queen),
			],
			[
				new Card(Suit.Clubs, Rank.Ace),
				new Card(Suit.Clubs, Rank.King),
				new Card(Suit.Clubs, Rank.Queen),
				new Card(Suit.Clubs, Rank.Ten),
				new Card(Suit.Clubs, Rank.Nine),
			],
		];
		aiPlayers = [new IdiotAI(), new IdiotAI(), new IdiotAI(), new IdiotAI()];
		trick = new TestTrick(Suit.Spades, false, hands, aiPlayers, Player.South, Player.South);
	});

	describe("playersPlayed", function () {
		it("Starts with no players having played", function () {
			expect(trick.playersPlayed()).toBe(0);
		});

		it("Correctly counts the number of players", function () {
			trick.playCard(new Card(Suit.Spades, Rank.Ace));
			expect(trick.playersPlayed()).toBe(1);
			trick.playCard(new Card(Suit.Diamonds, Rank.Ace));
			expect(trick.playersPlayed()).toBe(2);
			trick.playCard(new Card(Suit.Hearts, Rank.Ace));
			expect(trick.playersPlayed()).toBe(3);
			trick.playCard(new Card(Suit.Clubs, Rank.Ace));
			expect(trick.playersPlayed()).toBe(4);
		});

		it("Stops when all players have played", function () {
			trick.playCard(new Card(Suit.Spades, Rank.Ace));
			trick.playCard(new Card(Suit.Diamonds, Rank.Ace));
			trick.playCard(new Card(Suit.Hearts, Rank.Ace));
			trick.playCard(new Card(Suit.Clubs, Rank.Ace));
			trick.playCard(new Card(Suit.Spades, Rank.Right));
			expect(trick.playersPlayed()).toBe(4);
		});
	});

	describe("suitLead", function () {
		it("Starts with no suit", function () {
			expect(trick.suitLead()).toBe(undefined);
		});

		it("Becomes the suit of the first card lead", function () {
			trick.playCard(new Card(Suit.Spades, Rank.Ace));
			expect(trick.suitLead()).toBe(Suit.Spades);
		});

		it("Does not change after the first lead", function () {
			trick.playCard(new Card(Suit.Spades, Rank.Ace));
			expect(trick.suitLead()).toBe(Suit.Spades);
			trick.playCard(new Card(Suit.Diamonds, Rank.Ace));
			expect(trick.suitLead()).toBe(Suit.Spades);
			trick.playCard(new Card(Suit.Hearts, Rank.Ace));
			expect(trick.suitLead()).toBe(Suit.Spades);
			trick.playCard(new Card(Suit.Clubs, Rank.Ace));
			expect(trick.suitLead()).toBe(Suit.Spades);
		});
	});

	describe("cardsPlayed", function () {
		it("Starts empty", function () {
			expect(trick.cardsPlayed().length).toBe(0);
		});

		it("Collects the right cards in order, with the right players", function () {
			let cardsPlayed: PlayedCard[];

			trick.playCard(new Card(Suit.Spades, Rank.Ace));
			cardsPlayed = trick.cardsPlayed();
			expect(cardsPlayed.length).toBe(1);
			expect(cardsPlayed[0].card).toEqual(new Card(Suit.Spades, Rank.Ace));
			expect(cardsPlayed[0].player).toBe(Player.South);

			trick.playCard(new Card(Suit.Diamonds, Rank.King));
			cardsPlayed = trick.cardsPlayed();
			expect(cardsPlayed.length).toBe(2);
			expect(cardsPlayed[0].card).toEqual(new Card(Suit.Spades, Rank.Ace));
			expect(cardsPlayed[0].player).toBe(Player.South);
			expect(cardsPlayed[1].card).toEqual(new Card(Suit.Diamonds, Rank.King));
			expect(cardsPlayed[1].player).toBe(Player.West);

			trick.playCard(new Card(Suit.Hearts, Rank.Queen));
			cardsPlayed = trick.cardsPlayed();
			expect(cardsPlayed.length).toBe(3);
			expect(cardsPlayed[0].card).toEqual(new Card(Suit.Spades, Rank.Ace));
			expect(cardsPlayed[0].player).toBe(Player.South);
			expect(cardsPlayed[1].card).toEqual(new Card(Suit.Diamonds, Rank.King));
			expect(cardsPlayed[1].player).toBe(Player.West);
			expect(cardsPlayed[2].card).toEqual(new Card(Suit.Hearts, Rank.Queen));
			expect(cardsPlayed[2].player).toBe(Player.North);

			trick.playCard(new Card(Suit.Clubs, Rank.Ten));
			cardsPlayed = trick.cardsPlayed();
			expect(cardsPlayed.length).toBe(4);
			expect(cardsPlayed[0].card).toEqual(new Card(Suit.Spades, Rank.Ace));
			expect(cardsPlayed[0].player).toBe(Player.South);
			expect(cardsPlayed[1].card).toEqual(new Card(Suit.Diamonds, Rank.King));
			expect(cardsPlayed[1].player).toBe(Player.West);
			expect(cardsPlayed[2].card).toEqual(new Card(Suit.Hearts, Rank.Queen));
			expect(cardsPlayed[2].player).toBe(Player.North);
			expect(cardsPlayed[3].card).toEqual(new Card(Suit.Clubs, Rank.Ten));
			expect(cardsPlayed[3].player).toBe(Player.East);
		});

		it("Stops when all players have played", function () {
			trick.playCard(new Card(Suit.Spades, Rank.Ace));
			trick.playCard(new Card(Suit.Diamonds, Rank.King));
			trick.playCard(new Card(Suit.Hearts, Rank.Queen));
			trick.playCard(new Card(Suit.Clubs, Rank.Ten));
			trick.playCard(new Card(Suit.Spades, Rank.King));

			let cardsPlayed = trick.cardsPlayed();
			expect(cardsPlayed.length).toBe(4);
			expect(cardsPlayed[0].card).toEqual(new Card(Suit.Spades, Rank.Ace));
			expect(cardsPlayed[0].player).toBe(Player.South);
			expect(cardsPlayed[1].card).toEqual(new Card(Suit.Diamonds, Rank.King));
			expect(cardsPlayed[1].player).toBe(Player.West);
			expect(cardsPlayed[2].card).toEqual(new Card(Suit.Hearts, Rank.Queen));
			expect(cardsPlayed[2].player).toBe(Player.North);
			expect(cardsPlayed[3].card).toEqual(new Card(Suit.Clubs, Rank.Ten));
			expect(cardsPlayed[3].player).toBe(Player.East);
		});

		it("Copies the cards so they can't be changed", function () {
			let cardsPlayed: PlayedCard[];

			trick.playCard(new Card(Suit.Spades, Rank.Ace));
			cardsPlayed = trick.cardsPlayed();
			expect(cardsPlayed.length).toBe(1);
			expect(cardsPlayed[0].card).toEqual(new Card(Suit.Spades, Rank.Ace));
			expect(cardsPlayed[0].player).toBe(Player.South);

			cardsPlayed[0] = { player: Player.West, card: new Card(Suit.Hearts, Rank.Nine) };
			cardsPlayed = trick.cardsPlayed();
			expect(cardsPlayed.length).toBe(1);
			expect(cardsPlayed[0].card).toEqual(new Card(Suit.Spades, Rank.Ace));
			expect(cardsPlayed[0].player).toBe(Player.South);
		});

		it("Correctly copies the right", function () {
			let right = new Card(Suit.Spades, Rank.Jack);
			right.rank = Rank.Right;
			let cardsPlayed: PlayedCard[];

			trick.playCard(right);
			cardsPlayed = trick.cardsPlayed();
			expect(cardsPlayed.length).toBe(1);
			expect(cardsPlayed[0].card).toEqual(right);
			expect(cardsPlayed[0].player).toBe(Player.South);
		});

		it("Correctly copies the left", function () {
			let left = new Card(Suit.Clubs, Rank.Jack);
			left.rank = Rank.Left;
			left.suit = Suit.Spades;
			let cardsPlayed: PlayedCard[];

			trick.playCard(left);
			cardsPlayed = trick.cardsPlayed();
			expect(cardsPlayed.length).toBe(1);
			expect(cardsPlayed[0].card).toEqual(left);
			expect(cardsPlayed[0].player).toBe(Player.South);
		});
	});

	describe("playCard", function () {
		beforeEach(function () {
			trick = new TestTrick(Suit.Spades, false, hands, aiPlayers, Player.South, Player.West);
		});

		it("Handles a null card", function () {
			let firstCard = hands[Player.West][0];
			expect(trick.playCard(null)).toEqual(firstCard);
		});

		it("Handles a non-null card that's not in the player's hand", function () {
			let firstCard = hands[Player.West][0];
			expect(trick.playCard(new Card(Suit.Clubs, Rank.Ace))).toEqual(firstCard);
		});

		it("Handles a card that's in the player's hand but not legal to play", function () {
			expect(trick.playCard(new Card(Suit.Diamonds, Rank.Ace))).toEqual(new Card(Suit.Diamonds, Rank.Ace));
			expect(trick.playCard(new Card(Suit.Hearts, Rank.Ace))).toEqual(new Card(Suit.Diamonds, Rank.Jack));
		});

		it("Handles a legal card that's in the player's hand", function () {
			expect(trick.playCard(new Card(Suit.Diamonds, Rank.Ace))).toEqual(new Card(Suit.Diamonds, Rank.Ace));
			expect(trick.playCard(new Card(Suit.Diamonds, Rank.Jack))).toEqual(new Card(Suit.Diamonds, Rank.Jack));
			expect(trick.playCard(new Card(Suit.Clubs, Rank.Ace))).toEqual(new Card(Suit.Clubs, Rank.Ace));
		});

		it("Enforces the right play order", function () {
			expect(trick.currentPlayer()).toBe(Player.West);
			expect(trick.playCard(new Card(Suit.Diamonds, Rank.Ace))).toEqual(new Card(Suit.Diamonds, Rank.Ace));
			expect(trick.currentPlayer()).toBe(Player.North);
			let playedCards = trick.cardsPlayed();
			expect(playedCards.length).toBe(1);
			expect(playedCards[0].player).toBe(Player.West);
			trick.playCard(new Card(Suit.Hearts, Rank.Ace));
			expect(trick.currentPlayer()).toBe(Player.East);
			playedCards = trick.cardsPlayed();
			expect(playedCards.length).toBe(2);
			expect(playedCards[0].player).toBe(Player.West);
			expect(playedCards[1].player).toBe(Player.North);
		});

		it("Stops when the trick is done", function () {
			expect(trick.currentPlayer()).toBe(Player.West);
			expect(trick.playCard(new Card(Suit.Diamonds, Rank.Ace))).toEqual(new Card(Suit.Diamonds, Rank.Ace));
			expect(trick.playCard(new Card(Suit.Hearts, Rank.Ace))).toEqual(new Card(Suit.Diamonds, Rank.Jack));
			expect(trick.playCard(new Card(Suit.Clubs, Rank.Ace))).toEqual(new Card(Suit.Clubs, Rank.Ace));
			expect(trick.playCard(new Card(Suit.Spades, Rank.Ace))).toEqual(new Card(Suit.Spades, Rank.Ace));
			expect(trick.playCard(new Card(Suit.Diamonds, Rank.King))).toBeNull();
			let playedCards = trick.cardsPlayed();
			expect(playedCards.length).toBe(4);
			expect(playedCards[0].player).toBe(Player.West);
			expect(playedCards[1].player).toBe(Player.North);
			expect(playedCards[2].player).toBe(Player.East);
			expect(playedCards[3].player).toBe(Player.South);
		});
	});

	describe("isFinished", function () {
		it("Starts not finished", function () {
			expect(trick.isFinished()).toBe(false);
		});

		it("Finishes at the right time", function () {
			trick.playCard(new Card(Suit.Spades, Rank.Ace));
			expect(trick.isFinished()).toBe(false);
			trick.playCard(new Card(Suit.Hearts, Rank.King));
			expect(trick.isFinished()).toBe(false);
			trick.playCard(new Card(Suit.Diamonds, Rank.Queen));
			expect(trick.isFinished()).toBe(false);
			trick.playCard(new Card(Suit.Clubs, Rank.Ten));
			expect(trick.isFinished()).toBe(true);
		});

		describe("Alone", function () {
			beforeEach(function () {
				trick = new TestTrick(Suit.Spades, true, hands, aiPlayers, Player.South, Player.South);
			});

			it("Starts not finished", function () {
				expect(trick.isFinished()).toBe(false);
			});

			it("Finishes at the right time", function () {
				trick.playCard(new Card(Suit.Spades, Rank.Ace));
				expect(trick.isFinished()).toBe(false);
				trick.playCard(new Card(Suit.Hearts, Rank.King));
				expect(trick.isFinished()).toBe(false);
				trick.playCard(new Card(Suit.Clubs, Rank.Ten));
				expect(trick.isFinished()).toBe(true);
			});
		});
	});

	describe("winningTeam+winner", function () {
		it("Starts out null", function () {
			expect(trick.winningTeam()).toBeNull();
		});

		it("Updates correctly", function () {
			trick = new TestTrick(Suit.Spades, false, hands, aiPlayers, Player.South, Player.West);

			trick.playCard(null);
			expect(trick.winningTeam()).toBe(Team.EastWest);
			trick.playCard(null);
			expect(trick.winningTeam()).toBe(Team.EastWest);
			trick.playCard(null);
			expect(trick.winningTeam()).toBe(Team.EastWest);
			trick.playCard(null);
			expect(trick.winningTeam()).toBe(Team.NorthSouth);
		});
	});

	describe("doTrick", function () {
		it("Works with all players", function () {
			let trick = new Trick(Suit.Spades, false, hands, aiPlayers, Player.South, Player.West);
			expect(trick.doTrick()).toBe(true);
			expect(trick.currentPlayer()).toBe(Player.West);
			expect(trick.isFinished()).toBe(true);
			expect(trick.winner()).toBe(Player.South);
			expect(trick.winningTeam()).toBe(Team.NorthSouth);
			expect(trick.suitLead()).toBe(Suit.Diamonds);
			expect(trick.playersPlayed()).toBe(4);
			let playedCards = trick.cardsPlayed();
			expect(playedCards.length).toBe(4);
			expect(playedCards[0].player).toBe(Player.West);
			expect(playedCards[1].player).toBe(Player.North);
			expect(playedCards[2].player).toBe(Player.East);
			expect(playedCards[3].player).toBe(Player.South);
		});

		it("Works with a player going alone", function () {
			let trick = new Trick(Suit.Spades, true, hands, aiPlayers, Player.South, Player.West);
			expect(trick.doTrick()).toBe(true);
			expect(trick.currentPlayer()).toBe(Player.West);
			expect(trick.isFinished()).toBe(true);
			expect(trick.winner()).toBe(Player.South);
			expect(trick.winningTeam()).toBe(Team.NorthSouth);
			expect(trick.suitLead()).toBe(Suit.Diamonds);
			expect(trick.playersPlayed()).toBe(3);
			let playedCards = trick.cardsPlayed();
			expect(playedCards.length).toBe(3);
			expect(playedCards[0].player).toBe(Player.West);
			expect(playedCards[1].player).toBe(Player.East);
			expect(playedCards[2].player).toBe(Player.South);
		});
	});
});

class TestTrick extends Trick {
	public playCard(card: Card | null): Card | null {
		return super.playCard(card);
	}
}
