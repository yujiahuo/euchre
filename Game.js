/*****************************************************************************
 * Game stuff
 *****************************************************************************/

/**********************************************************
/* Constants
***********************************************************/
var DECKSIZE = 24;
var SORTEDDECK = [];
for(var suit in suits){
	if(suit==="props") continue;
	for(var rank in ranks){
		if(rank==="LEFT" || rank==="RIGHT") continue;

		SORTEDDECK.push(new Card(suits[suit], ranks[rank]));
	}
}

var DECKDICT = [];
for(var i=0; i<SORTEDDECK.length; i++){
	DECKDICT[SORTEDDECK[i].id] = SORTEDDECK[i];
}

var players = {
	NONE: -1,
	SOUTH: 0,
	WEST: 1,
	NORTH: 2,
	EAST: 3,

	props: {
		0: {"name": "South"},
		1: {"name": "West"},
		2: {"name": "North"},
		3: {"name": "East"},
	},
}

/**********************************************************
/* Session (not used yet)
***********************************************************/


/**********************************************************
/* Game
***********************************************************/
var deck; //contains the shuffled deck or what's left of it after dealing
var zIndex; //iterated to make sure the right cards end up on top when they move

/**********************************************************
/* Bidding
***********************************************************/
var isBidding;
var biddingRound;
var playersBid;

/**********************************************************
/* Hand
***********************************************************/
var hands; //2d array of everyone's hands
var nsScore; //north south
var weScore; //west east
var handNum
var trumpCandidate; //card
var trump; //"C", "S", "H", "D"
var rightID;
var leftID;
var dealer;
var makers;
var alonePlayer;

/**********************************************************
/* Trick
***********************************************************/
var trickNum;
var trickplayersPlayed;
var trickSuit;
var trickPlayedCards; //array of cards
var currentPlayer;
var nsTricksWon;
var weTricksWon;

/**********************************************************
/* Settings
***********************************************************/
var allFaceUp;

//4 AIs play against each other. You can plug in any AIs you want
var statMode;



