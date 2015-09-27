/***********
 *Card class
 ***********/
function Card(suit, number){
	this.suit = suit;
	this.number = number;
	this.id = suit + number;
	
	// this.elem = document.createElement("div");
	// this.elem.className = "card";
	// this.elem.id = suit + number;

//	var div = document.getElementById("gameSpace");
//	div.appendChild(this.elem);
}
