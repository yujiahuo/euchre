/*****************************************************************************
 * Globals n stuff
 *****************************************************************************/
//the game being played
var game;
//TODO: get rid of none?
var Player;
(function (Player) {
    Player[Player["South"] = 0] = "South";
    Player[Player["West"] = 1] = "West";
    Player[Player["North"] = 2] = "North";
    Player[Player["East"] = 3] = "East";
})(Player || (Player = {}));
var Suit;
(function (Suit) {
    Suit[Suit["Clubs"] = 0] = "Clubs";
    Suit[Suit["Diamonds"] = 1] = "Diamonds";
    Suit[Suit["Hearts"] = 2] = "Hearts";
    Suit[Suit["Spades"] = 3] = "Spades";
})(Suit || (Suit = {}));
var Rank;
(function (Rank) {
    Rank[Rank["Nine"] = 9] = "Nine";
    Rank[Rank["Ten"] = 10] = "Ten";
    Rank[Rank["Jack"] = 11] = "Jack";
    Rank[Rank["Queen"] = 12] = "Queen";
    Rank[Rank["King"] = 13] = "King";
    Rank[Rank["Ace"] = 14] = "Ace";
    Rank[Rank["Left"] = 15] = "Left";
    Rank[Rank["Right"] = 16] = "Right";
})(Rank || (Rank = {}));
var GameStage;
(function (GameStage) {
    GameStage[GameStage["NewGame"] = 0] = "NewGame";
    GameStage[GameStage["NewHand"] = 1] = "NewHand";
    GameStage[GameStage["BidRound1"] = 2] = "BidRound1";
    GameStage[GameStage["Discard"] = 3] = "Discard";
    GameStage[GameStage["BidRound2"] = 4] = "BidRound2";
    GameStage[GameStage["NewTrick"] = 5] = "NewTrick";
    GameStage[GameStage["PlayTricks"] = 6] = "PlayTricks";
    GameStage[GameStage["EndGame"] = 7] = "EndGame";
})(GameStage || (GameStage = {}));
var Card = (function () {
    function Card(suit, rank) {
        this.suit = suit;
        this.rank = rank;
        this.id = Suit[suit] + rank;
    }
    return Card;
}());
var DECKSIZE = 24;
//sorted deck of cards
//we create all the card objects used here
var SORTEDDECK = buildSortedDeck();
function buildSortedDeck() {
    var deck = [];
    var suits = [Suit.Clubs, Suit.Diamonds, Suit.Hearts, Suit.Spades];
    var ranks = [Rank.Nine, Rank.Ten, Rank.Jack, Rank.Queen, Rank.King, Rank.Ace];
    for (var _i = 0, suits_1 = suits; _i < suits_1.length; _i++) {
        var suit = suits_1[_i];
        for (var _a = 0, ranks_1 = ranks; _a < ranks_1.length; _a++) {
            var rank = ranks_1[_a];
            deck.push(new Card(suit, rank));
        }
    }
    return deck;
}
//dictionary of cards, keyed by card ID
//points to the cards we made for the sorted deck
var DECKDICT = [];
for (var i = 0; i < DECKSIZE; i++) {
    DECKDICT[SORTEDDECK[i].id] = SORTEDDECK[i];
}
var zIndex = 0; //iterated to make sure recently moved cards end up on top
/*****************************************************************************
 * Card object
 *****************************************************************************/
