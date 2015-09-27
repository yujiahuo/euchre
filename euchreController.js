//Yay Controller

var game;

function initialize(){
	//This will eventually do something probably, but maybe not
}

function newGame(){
	document.getElementById("cardsContainer").innerHTML = "";
	game = new Game;
	game.startNewGame(); //get the first hand going, deal out cards, start bids
}
function playCard(card){
	//
}