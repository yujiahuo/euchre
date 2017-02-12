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

//trick doesn't continue past when it should be done
//illegal plays don't work
//data is stored properly after a play
//BUG: one person keep playing for the whole trick and plays the same card

describe("Trick", function () {
	let deck;
	let aiPlayers;
	let result;

	//setup
	let hands = new Array(4);
	for (let i = 0; i < 4; i++) {
		hands[i] = new Array(5);
	}
	deck = getShuffledDeck();
	dealHands(deck, hands, 0);

	aiPlayers = [new DecentAI(), new IdiotAI(), new DecentAI(), new IdiotAI()];

	let trick = new Trick(Suit.Spades, false, hands, aiPlayers);

	//actual stuff
	it("stops when it should", function () {
		trick.playTrickStep(Player.East, hands[Player.East][0]);
		expect(trick.isFinished()).toBe(false);
		expect(trick.playersPlayed()).toBe(1);
		trick.playTrickStep(Player.South, hands[Player.South][0]);
		trick.playTrickStep(Player.West, hands[Player.West][0]);
		trick.playTrickStep(Player.North, hands[Player.North][0]);
		expect(trick.isFinished()).toBe(true);
		expect(trick.playersPlayed()).toBe(4);
		trick.playTrickStep(Player.East, hands[Player.East][0]);
		trick.playTrickStep(Player.South, hands[Player.South][0]);
		trick.playTrickStep(Player.West, hands[Player.West][0]);
		trick.playTrickStep(Player.North, hands[Player.North][0]);
		expect(trick.isFinished()).toBe(true);
		expect(trick.playersPlayed()).toBe(4);
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

describe("Trick alone", function () {
	//let hands;
	//let aiPlayers;
	//let trick; // = new Trick(Suit.Spades, true, hands, aiPlayers);
	//let result;
});
