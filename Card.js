/***********
 *Card class
 ***********/

var suitsArray = new Array();
suitsArray["C"] = "Clubs";
suitsArray["S"] = "Spades";
suitsArray["H"] = "Hearts";
suitsArray["D"] = "Diamonds";

var leftMap = new Array();
leftMap["C"] = "S";
leftMap["S"] = "C";
leftMap["H"] = "D";
leftMap["D"] = "H";

function Card(suit, number){
	this.suit = suit; //"C", "S", "H", "D"
	this.suitName = suitsArray[suit];
	this.number = number;
	this.id = suit + number;


}
