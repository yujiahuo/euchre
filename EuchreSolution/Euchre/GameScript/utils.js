function nextPlayer(currentPlayer) {
    return (currentPlayer + 1) % 4;
}

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

function dealHands(deck, hands, dealer) {
    var player, cardPos, card;

    for (var i = 0; i < 20; i++) {
        player = (dealer + i) % 4;

        cardPos = Math.floor(i / 4);
        card = deck.pop();
        hands[player][cardPos] = card;
    }
}