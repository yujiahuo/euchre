QUnit.test("set dealer", function (assert) {
    var result;

    result = getDealer(players.SOUTH);
    assert.equal(result, 1);

    result = getDealer(players.EAST);
    assert.equal(result, 0);

    result = getDealer(-1);
    assert.ok(result > -1 && result < 4);
});

QUnit.test("get shuffled deck", function (assert) {
    var result;

    result = getShuffledDeck();

    assert.ok(result.length === 24);
});

QUnit.test("deal hands", function (assert) {
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



//QUnit.test("doesn't explode", function (assert) {
//    var meow;

//    var __aiPlayers = [new DecentAI(), new DecentAI(), new DecentAI(), new DecentAI()];
//    var __hasHooman = __aiPlayers.indexOf(null) > -1;

//    assert.ok(true);
//});