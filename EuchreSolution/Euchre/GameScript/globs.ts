/*****************************************************************************
 * Globals n stuff
 *****************************************************************************/

//the game being played
let game: Game;

enum Player {
	South,
	West,
	North,
	East,
}

enum Team {
	NorthSouth,
	EastWest,
}

enum Suit {
	Clubs,
	Diamonds,
	Hearts,
	Spades,
}

let suitsArray = [Suit.Clubs, Suit.Diamonds, Suit.Hearts, Suit.Spades];

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
	OutsideGame,
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

	constructor(suit: Suit, rank: Rank)
	constructor(card: Card)
	constructor(suitOrCard: Suit | Card, rank?: Rank) {
		if (typeof suitOrCard === "number") {
			let suit = suitOrCard as Suit;
			this.suit = suit;
			this.rank = rank as Rank;
		} else {
			let card = suitOrCard;
			this.suit = card.suit;
			this.rank = card.rank;
		}

		let suitForId = this.suit;
		let rankForId = this.rank;
		if (rankForId === Rank.Right) {
			rankForId = Rank.Jack;
		} else if (rankForId === Rank.Left) {
			rankForId = Rank.Jack;
			suitForId = getOppositeSuit(suitForId);
		}
		this.id = Suit[suitForId] + rankForId;
	}

	static safeCard(card: Card): Card
	static safeCard(card: null): null
	static safeCard(card: Card | null): Card | null
	static safeCard(card: Card | null): Card | null {
		if (card) {
			return new Card(card);
		}
		return null;
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
	let deck: Card[] = [];
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
let DECKDICT: { [index: string]: Card } = {};
for (let i = 0; i < DECKSIZE; i++) {
	DECKDICT[SORTEDDECK[i].id] = SORTEDDECK[i];
}

let zIndex = 0; //iterated to make sure recently moved cards end up on top

let rng: XorGen;
{
	let seed = new Uint16Array(128);
	if (!seed.join) {
		seed.join = Array.prototype.join;
	}
	let cryptoObj = window.crypto || ((window as any).msCrypto as Crypto);
	if (cryptoObj && cryptoObj.getRandomValues) {
		cryptoObj.getRandomValues(seed);
	} else {
		// Not as good, but we can't actually end up with enough randomness
		// unless we include something outside of just Math.random
		seed[0] = new Date().getTime() % (2 ** 16);
		for (let i = 1; i < seed.length; i++) {
			seed[i] = Math.floor(Math.random() * (2 ** 16));
		}
	}
	console.log("Random seed: " + seed.join(", "));
	rng = new XorGen(seed);
}