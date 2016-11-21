/******************************************************
/* Never bids
/* Plays its first legal move
/*******************************************************/
var IdiotAI = (function () {
    function IdiotAI() {
    }
    IdiotAI.prototype.init = function () {
        //just chillin'
    };
    IdiotAI.prototype.chooseOrderUp = function () {
        return false;
    };
    IdiotAI.prototype.pickDiscard = function () {
        var hand;
        hand = game.myHand();
        return hand[0];
    };
    IdiotAI.prototype.pickTrump = function () {
        return null;
    };
    IdiotAI.prototype.chooseGoAlone = function () {
        return false;
    };
    IdiotAI.prototype.pickCard = function () {
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
    return IdiotAI;
}());
