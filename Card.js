/***********
 *Card object
 ***********/

var suits = {
	CLUBS: "C",
	DIAMONDS: "D",
	HEARTS: "H",
	SPADES: "S",

	props: {
		"C": {"name": "Clubs", "opposite": "S"},
		"D": {"name": "Diamonds", "opposite": "H"},
		"H": {"name": "Hearts", "opposite": "D"},
		"S": {"name": "Spades", "opposite": "C"},
	},
};

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

function Card(suit, rank){
	this.suit = suit;
	this.rank = rank;
	this.id = suit + rank;
}
