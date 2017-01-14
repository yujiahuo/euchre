/// <reference path="../../Scripts/typings/jasmine/jasmine.d.ts" />
/// <reference path="../../GameScript/globs.ts" />
/// <reference path="../../GameScript/utils.ts" />
/// <reference path="../../GameScript/playerAPI.ts" />
/// <reference path="../../GameScript/game.ts" />
/// <reference path="../../GameScript/animation.ts" />
/// <reference path="../../AIScript/decentAI.ts" />
/// <reference path="../../AIScript/idiotAI.ts" />

describe("getDealer", function () {
    var result;

    it("current player = south", function () {
        result = getDealer(Player.South);
        expect(result).toBe(Player.West);
    });

    it("current player = east", function () {
        result = getDealer(Player.East);
        expect(result).toBe(Player.South);
    });

    it("current player = no one", function () {
        result = getDealer();
        expect(result).toBeGreaterThan(-1);
        expect(result).toBeLessThan(4);
    });
});

describe("getShuffledDeck", function () {
    var result;

    result = getShuffledDeck();

    it("gets right size deck", function () {
        expect(result.length).toBe(24);
    });

});

describe("dealHands", function () {
    var deck;
    var hands;

    hands = new Array(4);
    for (i = 0; i < 4; i++) {
        hands[i] = new Array(5);
    }

    deck = getShuffledDeck();
    dealHands(deck, hands, 0);

    it("deals hands out", function () {
        for (var i = 0; i < 4; i++) {
            for (var j = 0; j < 5; j++) {
                expect(hands[i][j]).not.toBe(null);
            }
        }
    });
});

describe("greaterCard", function () {
    var card1;
    var card2;
    var trickSuit;
    var trump;

    trickSuit = Suit.Spades;
    trump = Suit.Hearts;

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
    var hand = [
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
    var hand = [
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


describe("canOrderUpSuit", function () {
    it("doesstuff", function () {
        //TODO: finish this expect().toBe();
    });
});


/*
describe("thing", function () {
    it("doesstuff", function () {
        expect().toBe();
    });
});
 */

