
//Just initializes all the variables
function initNewGame(){
	deck = [];
	hands = new Array(4);
	for(var i=0; i<4; i++){
		this.hands[i] = new Array(5);
	}
	nsScore = 0;
	weScore = 0;
	zIndex = 1;

	isBidding = false;
	biddingRound = 0;
	playersBid = 0;

	handNum = 0;
	trumpCandidate = "";
	trump = "";
	dealerID = -1;
	makerID = -1;
	alonePlayerID = -1;

	trickplayersPlayed = 0;
	trickNum = 0;
	trickSuit = "";
	trickPlayedCards = new Array(4);
	currentPlayerID = -1;
}

function newGame(){
	//place to play with settings
	allFaceUp = true;
	////////

	clearTable();
	initNewGame();

	newHand(0);
}

function clearTable(){
	animClearTable();
}

function nextPlayer(){
	currentPlayerID = (currentPlayerID+1)%4;
}