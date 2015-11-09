/**************************************************************
 * April Fools! Not actually a class. Just holds data we need.
 **************************************************************/

//Constants
var DECKSIZE = 24;

//Mappings
var playerNamesMap = ["South", "West", "North", "East"];

//Session data (not used yet)

//Game data
var deck; //contains the shuffled deck or what's left of it after dealing
var hands; //2d array of everyone's hands
var nsScore; //north south
var weScore; //west east
var zIndex;

//Bidding
var isBidding;
var biddingRound;
var playersBid;

//Hand
var handNum
var trumpCandidate;
var trump; //"C", "S", "H", "D"
var leftSuit;
var dealerID;
var makerID;
var alonePlayerID;

//Trick
var trickplayersPlayed;
var trickNum;
var trickSuit;
var trickPlayedCards;
var currentPlayerID;

//Settings
var allFaceUp;



