//**NOT TESTING**
function nextPlayer(currentPlayer) {
    return (currentPlayer + 1) % 4;
}

//**TESTED**
function getDealer(prevDealer) {
    var dealer;

    //if we have a dealer, get the next dealer
    if (prevDealer !== players.NONE) {
        dealer = nextPlayer(prevDealer);
    }
        //otherwise just randomly grab one
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
function getAIBid(player) {
    var stage;
    var ai;
    var bidSuit;

    stage = game.getGameStage();
    ai = game.getAIPlayer(player);

    if (ai === null) return;

    if (stage === gameStages.BID1) { //bidding round 1
        if (ai.chooseOrderUp()) {
            return game.getTrumpCandidateCard().suit;
        }
    }
    else if (stage === gameStages.BID2) { //bidding round 2
        bidSuit = ai.pickTrump();
        if (bidSuit) {
            return bidsuit;
        }
    }
    return null;
}

//**NOT TESTING**
function getGoAlone(player) {
    var aiPlayer;

    aiPlayer = game.getAIPlayer(player);

    if (aiPlayer !== null) {
        return aiPlayer.chooseGoAlone();
    }
}

