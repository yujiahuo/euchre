/******************************************************
/* Does whatever a test AI does
/*******************************************************/
var TestAI = (function () {
    function TestAI() {
    }
    TestAI.prototype.init = function () {
    };
    TestAI.prototype.chooseOrderUp = function () {
        return false;
    };
    TestAI.prototype.pickDiscard = function () {
        var hand;
        hand = game.myHand();
        return hand[0];
    };
    TestAI.prototype.pickTrump = function () {
        return Suit.Clubs;
    };
    TestAI.prototype.chooseGoAlone = function () {
        return false;
    };
    TestAI.prototype.pickCard = function () {
        var hand;
        hand = game.myHand();
        for (var i = 0; i < hand.length; i++) {
            if (isValidPlay(hand, hand[i], game.getTrickSuit())) {
                return hand[i];
            }
        }
        //we will never reach this but just in case
        return hand[0];
    };
    return TestAI;
}());
