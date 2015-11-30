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

var cardHierarchy = {};
cardHierarchy["0"] = 0;
cardHierarchy["9"] = 1;
cardHierarchy["10"] = 2;
cardHierarchy["J"] = 3;
cardHierarchy["Q"] = 4;
cardHierarchy["K"] = 5;
cardHierarchy["A"] = 6;
cardHierarchy["J2"] = 7;
cardHierarchy["J1"] = 8;

function Card(suit, number){
	this.suit = suit; //"C", "S", "H", "D"
	this.suitName = suitsArray[suit];
	this.number = number;
	this.id = suit + number;
}
