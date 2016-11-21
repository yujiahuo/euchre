/*****************************************************************************
 * Globals n stuff
 *****************************************************************************/

//the game being played
var game;

//TODO: get rid of none?
enum Player {
    South,
    West,
    North,
    East,
}

enum Suit {
    Clubs,
    Diamonds,
    Hearts,
    Spades,
}

enum Rank {
    Nine = 9,
    Ten = 10,
    Jack = 11,
    Queen = 12,
    King = 13,
    Ace = 14,
    Left = 15,
    Right = 16,
}

enum GameStage {
    NewGame,
    NewHand,
    BidRound1,
    Discard,
    BidRound2,
    NewTrick,
    PlayTricks, //TODO: figure out the right name
    EndGame,
}

class Card {
    public suit: Suit;
    public rank: Rank;
    public id: string;

    constructor(suit: Suit, rank: Rank) {
        this.suit = suit;
        this.rank = rank;
        this.id = Suit[suit] + rank;
    }
}

const DECKSIZE = 24;

//sorted deck of cards
//we create all the card objects used here
const SORTEDDECK: Card[] = buildSortedDeck();

function buildSortedDeck(): Card[] {
    let deck = [];
    let suits: Suit[] = [Suit.Clubs, Suit.Diamonds, Suit.Hearts, Suit.Spades];
    let ranks: Rank[] = [Rank.Nine, Rank.Ten, Rank.Jack, Rank.Queen, Rank.King, Rank.Ace];

    for (let suit of suits) {
        for (let rank of ranks) {
            deck.push(new Card(suit, rank));
        }
    }
    return deck;
}

//dictionary of cards, keyed by card ID
//points to the cards we made for the sorted deck
var DECKDICT: Card[] = [];
for (var i = 0; i < DECKSIZE; i++) {
    DECKDICT[SORTEDDECK[i].id] = SORTEDDECK[i];
}

var zIndex = 0; //iterated to make sure recently moved cards end up on top

/*****************************************************************************
 * Card object
 *****************************************************************************/

