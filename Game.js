/*****************************************************************************
 * April Fools! Not actually a class. Just some model that holds data we need.
 *****************************************************************************/

/**********************************************************
/* Constants
***********************************************************/
var DECKSIZE = 24;

/**********************************************************
/* Mappings, dicts n stuff
***********************************************************/
var playerNamesMap = ["South", "West", "North", "East"];
var sortedDeck = [new Card("C","9"),
				  new Card("C","10"),
				  new Card("C","J"),
	  			  new Card("C","Q"),
				  new Card("C","K"),
				  new Card("C","A"),
				  new Card("S","9"),
				  new Card("S","10"),
				  new Card("S","J"),
				  new Card("S","Q"),
				  new Card("S","K"),
				  new Card("S","A"),
				  new Card("D","9"),
				  new Card("D","10"),
				  new Card("D","J"),
				  new Card("D","Q"),
				  new Card("D","K"),
				  new Card("D","A"),
				  new Card("H","9"),
				  new Card("H","10"),
				  new Card("H","J"),
				  new Card("H","Q"),
				  new Card("H","K"),
				  new Card("H","A")
				  ];
var deckDict = {};
for(var i=0; i<sortedDeck.length; i++){
	deckDict[sortedDeck[i].id] = sortedDeck[i];
}

/**********************************************************
/* Session data (not used yet)
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
var trumpCandidate;
var trump; //"C", "S", "H", "D"
var rightID;
var leftID;
var dealerID;
var makerID;
var alonePlayerID;

/**********************************************************
/* Trick
***********************************************************/
var trickplayersPlayed;
var trickNum;
var trickSuit;
var trickPlayedCards; //array of cards
var currentPlayerID;

/**********************************************************
/* Settings
***********************************************************/
var allFaceUp;

//4 AIs play against each other. You can plug in any AIs you want into 
var statMode;



