/*******************************
* Get game properties
********************************/
function myHand() {
    return game.myHand();
}
//**TESTED**
//returns the card that is greater in this trick
//if a card is undefined, the other card wins
//if both cards are undefined, return null
function greaterCard(card1, card2, trickSuit, trump) {
    if (card1 === undefined) {
        return card2;
    }
    else if (card2 === undefined) {
        return card1;
    }
    if (isTrump(card1, trump)) {
        if (!isTrump(card2, trump)) {
            return card1;
        }
    }
    else if (isTrump(card2, trump)) {
        return card2;
    }
    if (followsSuit(card1, trickSuit)) {
        if (!followsSuit(card2, trickSuit)) {
            return card1;
        }
    }
    else if (followsSuit(card2, trickSuit)) {
        return card2;
    }
    //both/neither are trump and both/neither follows suit
    if (card1.rank > card2.rank)
        return card1;
    else
        return card2;
}
//**TESTED**
function isValidPlay(hand, card, trickSuit) {
    if (card == null) {
        return false;
    }
    if (!hasSuit(hand, trickSuit)) {
        return true;
    }
    if (followsSuit(card, trickSuit)) {
        return true;
    }
    return false;
}
//**NOT TESTING**
function isTrump(card, trump) {
    return card.suit === trump;
}
//**NOT TESTING**
function followsSuit(card, trickSuit) {
    if (!trickSuit) {
        return true;
    }
    if (card.suit === trickSuit) {
        return true;
    }
    return false;
}
//**TESTED**
function hasSuit(hand, suit) {
    for (var i = 0; i < hand.length; i++) {
        if (hand[i].suit === suit)
            return true;
    }
    return false;
}
/* Returns whether or not it is currently legal for the given player to
   order up a given suit.
   Depends on bidding round */
function canOrderUpSuit(hand, suit) {
    if (game.getBiddingRound() === 1) {
        if (game.getTrumpCandidate().suit !== suit)
            return false;
        if (hasSuit(hand, suit))
            return true;
    }
    if (game.getBiddingRound() === 2) {
        if (game.getTrumpCandidate().suit === suit)
            return false;
        if (hasSuit(hand, suit))
            return true;
    }
    return false;
}
//how many cards of a given suit you have
function numCardsOfSuit(hand, suit) {
    var count = 0;
    for (var i = 0; i < hand.length; i++) {
        if (hand[i].suit === suit)
            count++;
    }
    return count;
}
//number of suits you're holding
function countSuits() {
    var suitArray = [];
    var hand = myHand();
    for (var i = 0; i < hand.length; i++) {
        suitArray[hand[i].suit] = 1;
    }
    return suitArray[Suit.Clubs] + suitArray[Suit.Diamonds] + suitArray[Suit.Hearts] + suitArray[Suit.Spades];
}
function getCardValue(card, trump) {
    var value;
    value = card.rank;
    if (isTrump(card, trump))
        value += 100;
    return value;
}
function getWorstCard(hand, trickSuit, trump, mustBeLegal) {
    var worstCard;
    var worstValue = 1000;
    var value;
    for (var i = 0; i < hand.length; i++) {
        if (mustBeLegal && !isValidPlay(hand, hand[i], trickSuit))
            continue;
        value = getCardValue(hand[i], trump);
        if (value < worstValue) {
            worstCard = hand[i];
            worstValue = value;
        }
    }
    return worstCard;
}
//returns: the best card and who played it as: [card, player]
function getBestCard(cards, trickSuit, trump) {
    var bestCard;
    var bestValue = 0;
    var value;
    var player;
    for (var i = 0; i < cards.length; i++) {
        if (!isValidPlay(cards, cards[i], trickSuit))
            continue;
        value = getCardValue(cards[i], trump);
        if (value > bestValue) {
            bestCard = cards[i];
            player = i;
            bestValue = value;
        }
    }
    return [bestCard, player];
}
function getFirstLegalCard(hand) {
    for (var i = 0; i < hand.length; i++) {
        if (isValidPlay(hand, hand[i], game.getTrickSuit())) {
            return hand[i];
        }
    }
}
