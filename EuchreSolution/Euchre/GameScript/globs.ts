/*****************************************************************************
 * Globals n stuff
 *****************************************************************************/

//the game being played
let game: Game;

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

let suitsArray: Suit[] = [Suit.Clubs, Suit.Diamonds, Suit.Hearts, Suit.Spades];

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
	PlayTricks,
	EndGame,
}

enum MessageLevel {
	Step,
	Game,
	Multigame,
}

class Card {
	public suit: Suit;
	public rank: Rank;
	public id: string;

	constructor(suit: Suit, rank: Rank, id?: string) {
		this.suit = suit;
		this.rank = rank;
		if (id) this.id = id;
		else this.id = Suit[suit] + rank;
	}
}

interface PlayedCard {
	player: Player;
	card: Card;
}

const DECKSIZE = 24;

//sorted deck of cards
//we create all the card objects used here
const SORTEDDECK: Card[] = buildSortedDeck();

function buildSortedDeck(): Card[] {
	let deck = [];
	let ranks: Rank[] = [Rank.Nine, Rank.Ten, Rank.Jack, Rank.Queen, Rank.King, Rank.Ace];

	for (let suit of suitsArray) {
		for (let rank of ranks) {
			deck.push(new Card(suit, rank));
		}
	}
	return deck;
}

//dictionary of cards, keyed by card ID
//points to the cards we made for the sorted deck
let DECKDICT: Card[] = [];
for (let i = 0; i < DECKSIZE; i++) {
	DECKDICT[SORTEDDECK[i].id] = SORTEDDECK[i];
}

let zIndex = 0; //iterated to make sure recently moved cards end up on top

/*****************************************************************************
 * Card object
 *****************************************************************************/

