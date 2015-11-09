/***********
 *Card class
 ***********/

var suitsArray = new Array();
suitsArray["C"] = "Clubs";
suitsArray["S"] = "Spades";
suitsArray["H"] = "Hearts";
suitsArray["D"] = "Diamonds";

function Card(suit, number){
	this.suit = suit;
	this.suitName = suitsArray[suit];
	this.number = number;
	this.id = suit + number;


}
