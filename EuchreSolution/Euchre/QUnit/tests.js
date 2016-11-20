QUnit.test("getDealer", function (assert) {
    var result;

    result = getDealer(players.SOUTH);
    assert.equal(result, 1);

    result = getDealer(players.EAST);
    assert.equal(result, 0);

    result = getDealer(-1);
    assert.ok(result > -1 && result < 4);
});

QUnit.test("getShuffledDeck", function (assert) {
    var result;

    result = getShuffledDeck();

    assert.ok(result.length === 24);
});

QUnit.test("dealHands", function (assert) {
    var deck;
    var hands;

    hands = new Array(4);
    for (i = 0; i < 4; i++) {
        hands[i] = new Array(5);
    }

    deck = getShuffledDeck();
    dealHands(deck, hands, 0);

    assert.ok(deck.length === 4);
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 5; j++) {
            assert.ok(hands[i][j]);
        }
    }
});

QUnit.test("greaterCard", function (assert) {
    var card1;
    var card2;
    var trickSuit;
    var trump;

    trickSuit = suits.SPADES;
    trump = suits.HEARTS;


    //FOLLOW SUIT: neither, TRUMP: neither
    card1 = new Card(suits.CLUBS, ranks.NINE);
    card2 = new Card(suits.CLUBS, ranks.TEN);
    assert.ok(greaterCard(card1, card2, trickSuit, trump) === card2);

    //FOLLOW SUIT: both, TRUMP: neither
    card1 = new Card(suits.SPADES, ranks.NINE);
    card2 = new Card(suits.SPADES, ranks.TEN);
    assert.ok(greaterCard(card1, card2, trickSuit, trump) === card2);

    //FOLLOW SUIT: neither, TRUMP: both
    card1 = new Card(suits.HEARTS, ranks.NINE);
    card2 = new Card(suits.HEARTS, ranks.TEN);
    assert.ok(greaterCard(card1, card2, trickSuit, trump) === card2);

    //FOLLOW SUIT: 1, TRUMP: neither
    card1 = new Card(suits.SPADES, ranks.NINE);
    card2 = new Card(suits.CLUBS, ranks.TEN);
    assert.ok(greaterCard(card1, card2, trickSuit, trump) === card1);

    //FOLLOW SUIT: 2, TRUMP: 1
    card1 = new Card(suits.HEARTS, ranks.NINE);
    card2 = new Card(suits.SPADES, ranks.TEN);
    assert.ok(greaterCard(card1, card2, trickSuit, trump) === card1);

    //FOLLOW SUIT: 2, TRUMP: 1
    card1 = new Card(suits.HEARTS, ranks.TEN);
    card2 = new Card(suits.SPADES, ranks.NINE);
    assert.ok(greaterCard(card1, card2, trickSuit, trump) === card1);
});



//QUnit.test("doesn't explode", function (assert) {
//    var meow;

//    var __aiPlayers = [new DecentAI(), new DecentAI(), new DecentAI(), new DecentAI()];
//    var __hasHooman = __aiPlayers.indexOf(null) > -1;

//    assert.ok(true);
//});