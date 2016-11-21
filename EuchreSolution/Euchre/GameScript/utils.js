//**NOT TESTING**
function nextPlayer(currentPlayer) {
    switch (currentPlayer) {
        case Player.South:
            return Player.West;
        case Player.West:
            return Player.North;
        case Player.North:
            return Player.East;
        case Player.East:
            return Player.South;
        default:
            return null;
    }
}
//**NOT TESTING**
function getPartner(player) {
    switch (player) {
        case Player.South:
            return Player.North;
        case Player.West:
            return Player.East;
        case Player.North:
            return Player.South;
        case Player.East:
            return Player.West;
        default:
            return null;
    }
}
//**NOT TESTING**
function getOppositeSuit(suit) {
    switch (suit) {
        case Suit.Clubs:
            return Suit.Spades;
        case Suit.Diamonds:
            return Suit.Hearts;
        case Suit.Hearts:
            return Suit.Diamonds;
        case Suit.Spades:
            return Suit.Clubs;
    }
}
//**TESTED**
function getDealer(prevDealer) {
    var dealer;
    //if we have a dealer, get the next dealer
    if (prevDealer !== undefined) {
        dealer = nextPlayer(prevDealer);
    }
    else {
        dealer = Math.floor(Math.random() * 4);
    }
    return dealer;
}
//**TESTED**
function getShuffledDeck() {
    var deck;
    var pos;
    var temp;
    var size;
    size = SORTEDDECK.length;
    deck = [];
    for (var i = 0; i < size; i++) {
        deck.splice(Math.floor(Math.random() * (i + 1)), 0, SORTEDDECK[i]);
    }
    return deck;
}
//**TESTED**
function dealHands(deck, hands, dealer) {
    var player, cardPos, card;
    for (var i = 0; i < 20; i++) {
        player = (dealer + i) % 4;
        cardPos = Math.floor(i / 4);
        card = deck.pop();
        hands[player][cardPos] = card;
    }
}
//**NOT TESTING**
//returns: bid suit
function getAIBid(aiPlayer, stage) {
    var bidSuit;
    if (stage === GameStage.BidRound1) {
        if (aiPlayer.chooseOrderUp()) {
            return game.getTrumpCandidateCard().suit;
        }
    }
    else if (stage === GameStage.BidRound2) {
        bidSuit = aiPlayer.pickTrump();
        if (bidSuit !== undefined) {
            return bidSuit;
        }
    }
    return null;
}
