///<reference path="../../GameScript/globs.js" />
///<reference path="../../GameScript/utils.js" />
///<reference path="../../GameScript/playerAPI.js" />
///<reference path="../../GameScript/game.js" />
///<reference path="../../GameScript/animation.js" />
///<reference path="../../AIScript/decentAI.js" />
///<reference path="../../AIScript/idiotAI.js" />

describe("getDealer", function () {
    var result;

    it("current player = south", function () {
        result = getDealer(players.SOUTH);
        expect(result).toBe(1);
    });
    
    it("current playet = east", function () {
        result = getDealer(players.EAST);
        expect(result).toBe(0);
    });

    it("current playet = no one", function () {
        result = getDealer(-1);
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

    trickSuit = suits.SPADES;
    trump = suits.HEARTS;

    it("FOLLOW SUIT: neither, TRUMP: neither", function () {
        card1 = new Card(suits.CLUBS, ranks.NINE);
        card2 = new Card(suits.CLUBS, ranks.TEN);
        expect(greaterCard(card1, card2, trickSuit, trump)).toBe(card2);
    });

    it("FOLLOW SUIT: both, TRUMP: neither", function () {
        card1 = new Card(suits.SPADES, ranks.NINE);
        card2 = new Card(suits.SPADES, ranks.TEN);
        expect(greaterCard(card1, card2, trickSuit, trump)).toBe(card2);
    });

    it("FOLLOW SUIT: neither, TRUMP: both", function () {
        card1 = new Card(suits.HEARTS, ranks.NINE);
        card2 = new Card(suits.HEARTS, ranks.TEN);
        expect(greaterCard(card1, card2, trickSuit, trump)).toBe(card2);
    });

    it("FOLLOW SUIT: 1, TRUMP: neither", function () {
        card1 = new Card(suits.SPADES, ranks.NINE);
        card2 = new Card(suits.CLUBS, ranks.TEN);
        expect(greaterCard(card1, card2, trickSuit, trump)).toBe(card1);
    });

    it("FOLLOW SUIT: 2, TRUMP: 1", function () {
        card1 = new Card(suits.HEARTS, ranks.NINE);
        card2 = new Card(suits.SPADES, ranks.TEN);
        expect(greaterCard(card1, card2, trickSuit, trump)).toBe(card1);
    });
});

describe("isValidPlay", function () {
    var hand = [
                new Card(suits.SPADES, ranks.NINE),
                new Card(suits.SPADES, ranks.TEN),
                new Card(suits.SPADES, ranks.JACK),
                new Card(suits.SPADES, ranks.QUEEN),
                new Card(suits.SPADES, ranks.KING),
    ];

    it("has tricksuit, play tricksuit", function () {
        expect(isValidPlay(hand, hand[0], suits.SPADES)).toBe(true);
    });

    it("doesn't have tricksuit", function () {
        expect(isValidPlay(hand, hand[0], suits.CLUBS)).toBe(true);
    });

    it("has tricksuit, plays invalid", function () {
        hand[0] = new Card(suits.CLUBS, ranks.NINE);
        expect(isValidPlay(hand, hand[0], suits.SPADES)).toBe(false);
    });
});

describe("hasSuit", function () {
    var hand = [
                new Card(suits.SPADES, ranks.NINE),
                new Card(suits.SPADES, ranks.TEN),
                new Card(suits.SPADES, ranks.JACK),
                new Card(suits.SPADES, ranks.QUEEN),
                new Card(suits.SPADES, ranks.KING),
    ];

    it("has suit", function () {
        expect(hasSuit(hand, suits.SPADES)).toBe(true);
    });

    it("doesn't have suit", function () {
        expect(hasSuit(hand, suits.CLUBS)).toBe(false);
    });
});


describe("canOrderUpSuit", function () {
    it("doesstuff", function () {
        expect().toBe();
    });
});


/*
describe("thing", function () {
    it("doesstuff", function () {
        expect().toBe();
    });
});
 */

