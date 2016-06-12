var trump;
var card;

QUnit.test("set dealer", function (assert) {
    var result;

    result = getDealer(players.SOUTH);
    assert.equal(result, 1);

    result = getDealer(players.EAST);
    assert.equal(result, 0);

    result = getDealer(-1);
    assert.ok(result > -1 && result < 4);
});