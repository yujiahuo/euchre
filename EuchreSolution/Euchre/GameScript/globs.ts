/*****************************************************************************
 * Globals n stuff
 *****************************************************************************/

//tslint:disable-next-line:no-var-keyword
var controller: Controller | null = null;

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

enum MessageLevel {
	Step,
	Game,
	Multigame,
}

const DECKSIZE = 24;

//sorted deck of cards
//we create all the card objects used here
const SORTEDDECK: Card[] = buildSortedDeck();

//I think we deleted this, but I kind of need it for human players clicking cards
let DECKDICT: { [id: string]: Card } = {};
for (let i = 0; i < SORTEDDECK.length; i++) {
	DECKDICT[SORTEDDECK[i].id] = SORTEDDECK[i];

}

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

let zIndex = 0; //iterated to make sure recently moved cards end up on top
