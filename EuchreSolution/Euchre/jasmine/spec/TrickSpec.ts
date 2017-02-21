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

describe("Trick", function () {
	let trick: Trick;
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
		trick = new Trick(Suit.Spades, false, hands, aiPlayers);
	});

	describe("playersPlayed", function () {
		it("Starts with no players having played", function () {
			expect(trick.playersPlayed()).toBe(0);
		});

		it("Correctly counts the number of players", function () {
			trick.playTrickStep(Player.South, new Card(Suit.Spades, Rank.Ace));
			expect(trick.playersPlayed()).toBe(1);
			trick.playTrickStep(Player.West, new Card(Suit.Hearts, Rank.Ace));
			expect(trick.playersPlayed()).toBe(2);
			trick.playTrickStep(Player.North, new Card(Suit.Diamonds, Rank.Ace));
			expect(trick.playersPlayed()).toBe(3);
			trick.playTrickStep(Player.East, new Card(Suit.Clubs, Rank.Ace));
			expect(trick.playersPlayed()).toBe(4);
		});

		it("Stops when all players have played", function () {
			trick.playTrickStep(Player.South, new Card(Suit.Spades, Rank.Ace));
			trick.playTrickStep(Player.West, new Card(Suit.Hearts, Rank.Ace));
			trick.playTrickStep(Player.North, new Card(Suit.Diamonds, Rank.Ace));
			trick.playTrickStep(Player.East, new Card(Suit.Clubs, Rank.Ace));
			trick.playTrickStep(Player.South, new Card(Suit.Spades, Rank.Right));
			expect(trick.playersPlayed()).toBe(4);
		});
	});

	describe("suitLead", function () {
		it("Starts with no suit", function () {
			expect(trick.suitLead()).toBe(undefined);
		});

		it("Becomes the suit of the first card lead", function () {
			trick.playTrickStep(Player.South, new Card(Suit.Spades, Rank.Ace));
			expect(trick.suitLead()).toBe(Suit.Spades);
		});

		it("Does not change after the first lead", function () {
			trick.playTrickStep(Player.West, new Card(Suit.Diamonds, Rank.Ace));
			expect(trick.suitLead()).toBe(Suit.Diamonds);
			trick.playTrickStep(Player.North, new Card(Suit.Hearts, Rank.Ace));
			expect(trick.suitLead()).toBe(Suit.Diamonds);
			trick.playTrickStep(Player.East, new Card(Suit.Clubs, Rank.Ace));
			expect(trick.suitLead()).toBe(Suit.Diamonds);
			trick.playTrickStep(Player.South, new Card(Suit.Spades, Rank.Ace));
			expect(trick.suitLead()).toBe(Suit.Diamonds);
		});
	});

	describe("cardsPlayed", function () {
		it("Starts empty", function () {
			expect(trick.cardsPlayed().length).toBe(0);
		});

		it("Collects the right cards in order, with the right players", function () {
			let cardsPlayed: PlayedCard[];

			trick.playTrickStep(Player.South, new Card(Suit.Spades, Rank.Ace));
			cardsPlayed = trick.cardsPlayed();
			expect(cardsPlayed.length).toBe(1);
			expect(cardsPlayed[0].card).toEqual(new Card(Suit.Spades, Rank.Ace));
			expect(cardsPlayed[0].player).toBe(Player.South);

			trick.playTrickStep(Player.West, new Card(Suit.Diamonds, Rank.King));
			cardsPlayed = trick.cardsPlayed();
			expect(cardsPlayed.length).toBe(2);
			expect(cardsPlayed[0].card).toEqual(new Card(Suit.Spades, Rank.Ace));
			expect(cardsPlayed[0].player).toBe(Player.South);
			expect(cardsPlayed[1].card).toEqual(new Card(Suit.Diamonds, Rank.King));
			expect(cardsPlayed[1].player).toBe(Player.West);

			trick.playTrickStep(Player.North, new Card(Suit.Hearts, Rank.Queen));
			cardsPlayed = trick.cardsPlayed();
			expect(cardsPlayed.length).toBe(3);
			expect(cardsPlayed[0].card).toEqual(new Card(Suit.Spades, Rank.Ace));
			expect(cardsPlayed[0].player).toBe(Player.South);
			expect(cardsPlayed[1].card).toEqual(new Card(Suit.Diamonds, Rank.King));
			expect(cardsPlayed[1].player).toBe(Player.West);
			expect(cardsPlayed[2].card).toEqual(new Card(Suit.Hearts, Rank.Queen));
			expect(cardsPlayed[2].player).toBe(Player.North);

			trick.playTrickStep(Player.East, new Card(Suit.Clubs, Rank.Ten));
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
			trick.playTrickStep(Player.South, new Card(Suit.Spades, Rank.Ace));
			trick.playTrickStep(Player.West, new Card(Suit.Diamonds, Rank.King));
			trick.playTrickStep(Player.North, new Card(Suit.Hearts, Rank.Queen));
			trick.playTrickStep(Player.East, new Card(Suit.Clubs, Rank.Ten));
			trick.playTrickStep(Player.South, new Card(Suit.Spades, Rank.King));

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

			trick.playTrickStep(Player.South, new Card(Suit.Spades, Rank.Ace));
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
	});

	describe("playTrickStep", function () {
		it("Handles a null card", function () {
			expect(trick.playTrickStep(Player.South, null)).toEqual(hands[Player.South][0]);
		});

		it("Handles a non-null card that's not in the player's hand", function () {
			expect(trick.playTrickStep(Player.South, new Card(Suit.Hearts, Rank.Ace))).toEqual(hands[Player.South][0]);
		});

		it("Handles a card that's in the player's hand but not legal to play", function () {
			expect(trick.playTrickStep(Player.West, new Card(Suit.Diamonds, Rank.Ace))).toEqual(new Card(Suit.Diamonds, Rank.Ace));
			expect(trick.playTrickStep(Player.North, new Card(Suit.Hearts, Rank.Ace))).toEqual(new Card(Suit.Diamonds, Rank.Jack));
		});

		it("Handles a legal card that's in the player's hand", function () {
			expect(trick.playTrickStep(Player.West, new Card(Suit.Diamonds, Rank.Ace))).toEqual(new Card(Suit.Diamonds, Rank.Ace));
			expect(trick.playTrickStep(Player.North, new Card(Suit.Diamonds, Rank.Jack))).toEqual(new Card(Suit.Diamonds, Rank.Jack));
		});

		it("Enforces the right play order", function () {
			expect(trick.playTrickStep(Player.South, new Card(Suit.Spades, Rank.Ace))).toEqual(new Card(Suit.Spades, Rank.Ace));
			expect(trick.playTrickStep(Player.East, new Card(Suit.Clubs, Rank.Ace))).toThrow();
		});
	});

	describe("isFinished", function () {
		it("Starts not finished", function () {
			expect(trick.isFinished()).toBe(false);
		});

		it("Finishes at the right time", function () {
			trick.playTrickStep(Player.South, new Card(Suit.Spades, Rank.Ace));
			expect(trick.isFinished()).toBe(false);
			trick.playTrickStep(Player.West, new Card(Suit.Hearts, Rank.King));
			expect(trick.isFinished()).toBe(false);
			trick.playTrickStep(Player.North, new Card(Suit.Diamonds, Rank.Queen));
			expect(trick.isFinished()).toBe(false);
			trick.playTrickStep(Player.East, new Card(Suit.Clubs, Rank.Ten));
			expect(trick.isFinished()).toBe(true);
		});

		describe("Alone", function () {
			beforeEach(function () {
				trick = new Trick(Suit.Spades, true, hands, aiPlayers);
			});

			it("Starts not finished", function () {
				expect(trick.isFinished()).toBe(false);
			});

			it("Finishes at the right time", function () {
				trick.playTrickStep(Player.South, new Card(Suit.Spades, Rank.Ace));
				expect(trick.isFinished()).toBe(false);
				trick.playTrickStep(Player.West, new Card(Suit.Hearts, Rank.King));
				expect(trick.isFinished()).toBe(false);
				trick.playTrickStep(Player.East, new Card(Suit.Clubs, Rank.Ten));
				expect(trick.isFinished()).toBe(true);
			});
		});
	});

	describe("winningTeam+winner", function () {
		it("Starts out null", function () {
			expect(trick.winningTeam()).toBeNull();
		});

		it("Updates correctly", function () {
			trick.playTrickStep(Player.West, null);
			expect(trick.winningTeam()).toBe(Team.EastWest);
			trick.playTrickStep(Player.North, null);
			expect(trick.winningTeam()).toBe(Team.EastWest);
			trick.playTrickStep(Player.East, null);
			expect(trick.winningTeam()).toBe(Team.EastWest);
			trick.playTrickStep(Player.South, null);
			expect(trick.winningTeam()).toBe(Team.NorthSouth);
		});
	});
});
