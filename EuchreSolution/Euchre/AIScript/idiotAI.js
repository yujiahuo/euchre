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
        return getFirstLegalCard(myHand());
    };
    return IdiotAI;
}());
