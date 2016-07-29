/*****************************************************************************
 * Globals n stuff
 *****************************************************************************/

//the game being played
var game;

//enum of players
var players = {
    NONE: -1,
    SOUTH: 0,
    WEST: 1,
    NORTH: 2,
    EAST: 3,

    props: {
        0: { "name": "South", "partner": 2 },
        1: { "name": "West", "partner": 3 },
        2: { "name": "North", "partner": 0 },
        3: { "name": "East", "partner": 1 },
    },
}

//enum of suits
var suits = {
    CLUBS: "C",
    DIAMONDS: "D",
    HEARTS: "H",
    SPADES: "S",

    props: {
        "C": { "name": "Clubs", "opposite": "S" },
        "D": { "name": "Diamonds", "opposite": "H" },
        "H": { "name": "Hearts", "opposite": "D" },
        "S": { "name": "Spades", "opposite": "C" },
    },
};

//enum of ranks
var ranks = {
    NINE: 9,
    TEN: 10,
    JACK: 11,
    QUEEN: 12,
    KING: 13,
    ACE: 14,
    LEFT: 15,
    RIGHT: 16,
};

//enum of game stage
var gameStages = {
    BID1: 0,
    BID2: 1,
    TRICKS: 2,
};

var DECKSIZE = 24;

//sorted deck of cards
//we create all the card objects used here
var SORTEDDECK = [];
for (var suit in suits) {
    if (suit === "props") continue; //y dis have to loop props?
    for (var rank in ranks) {
        if (rank === "LEFT" || rank === "RIGHT") continue;
        SORTEDDECK.push(new Card(suits[suit], ranks[rank]));
    }
}
//dictionary of cards, keyed by card ID
//points to the cards we made for the sorted deck
var DECKDICT = [];
for (var i = 0; i < SORTEDDECK.length; i++) {
    DECKDICT[SORTEDDECK[i].id] = SORTEDDECK[i];
}

var zIndex = 0; //iterated to make sure recently moved cards end up on top

/*****************************************************************************
 *Card object
 *****************************************************************************/

function Card(suit, rank, id) {
    this.suit = suit;
    this.rank = rank;
    if (id) {
        this.id = id;
    }
    else {
        this.id = suit + rank;
    }
}