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
