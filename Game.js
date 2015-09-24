/***********
 *Game class
 ***********/

function Game(){
	//initialize some properties
	this.deck = [];
	this.southHand = [];
	this.westHand = [];
	this.northHand = [];
	this.eastHand = [];
	
	this.trumpCandidate = "";
	this.trump = "";
	this.currentPlayer = "";
	this.dealer = "";
	this.maker = "";
	this.alonePlayer = "";
	
	this.nsScore = 0;
	this.weScore = 0;
	
	this.handHistory = [];
	
	alert("constructor");
	
	//functions start
	this.startGame = function(){
		alert("starting");
	}
}



function newHand(){
	//get new deck of shuffled cards
	
	//deal them out
	
	//make bidding happen
	
	//play tricks
}

function deal(){
	//shuffle into deck object thing
	
	//deal them out
}

/***********
 *Card class
 ***********/
function Card(suit, number){
	this.number = number;
	this.suit = suit;
	
	this.elem = document.createElement("div");
	this.elem.className = "card";
	this.elem.id = suit + number;

//	var div = document.getElementById("gameSpace");
//	div.appendChild(this.elem);
}



