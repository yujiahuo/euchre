/***********
 *Card class
 ***********/

var suitsArray = new Array();
suitsArray["C"] = "Clubs";
suitsArray["S"] = "Spades";
suitsArray["H"] = "Hearts";
suitsArray["D"] = "Diamonds";

function Card(suit, number){
	this.suit = suitsArray[suit];
	this.number = number;
	this.id = suit + number;
	
	// this.elem = document.createElement("div");
	// this.elem.className = "card";
	// this.elem.id = suit + number;

//	var div = document.getElementById("gameSpace");
//	div.appendChild(this.elem);
}
