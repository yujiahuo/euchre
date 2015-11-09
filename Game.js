/***********
 *Game class
 ***********/

var playerArray = ["South", "West", "North", "East"];

function Game(){
	//initialize some properties
	this.deck = [];
	this.deckSize = 24;
	//an array of card objects
	//hand[0] is south, etc.
	this.hands = new Array(4);
	for(var i=0; i<4; i++){
		this.hands[i] = new Array(5);
	}
	
	this.trumpCandidate;
	this.trump = ""; //suit name
	this.currentPlayerID = 0;
	this.dealerID = -1;
	this.makerID = 0;
	this.alonePlayerID = 0;
	
	this.nsScore = 0; //north south
	this.weScore = 0; //west east
	
	this.handHistory = [];

	//settings that do stuff
	this.allFaceUp;


	//functions start
	this.initNewGame = function(){
		
	}

	this.pickDealer = function(){
		//if we have a dealer, get the next dealer
		if(this.dealerID > -1){
			this.dealerID = (this.dealerID+1)%4;
		}
		//otherwise just randomly grab one
		else{
			this.dealerID = Math.floor(Math.random() * 4);
		}
		console.log(playerArray[this.dealerID] + this.dealerID + " is the dealer.");
	}

	this.getShuffledDeck = function(){
		var pos,temp,size;
		size = 24;

		this.deck = [new Card("C","9"),
					 new Card("C","10"),
					 new Card("C","J"),
					 new Card("C","Q"),
					 new Card("C","K"),
					 new Card("C","A"),
					 new Card("S","9"),
					 new Card("S","10"),
					 new Card("S","J"),
					 new Card("S","Q"),
					 new Card("S","K"),
					 new Card("S","A"),
					 new Card("D","9"),
					 new Card("D","10"),
					 new Card("D","J"),
					 new Card("D","Q"),
					 new Card("D","K"),
					 new Card("D","A"),
					 new Card("H","9"),
					 new Card("H","10"),
					 new Card("H","J"),
					 new Card("H","Q"),
					 new Card("H","K"),
					 new Card("H","A")
					 ]

		for(var i=0; i<size; i++){
			pos = Math.floor(Math.random() * size)
			temp = this.deck[i];
			this.deck[i] = this.deck[pos];
			this.deck[pos] = temp;
		}
	}

	this.addToHand = function(playerID, card){
		this.hands[playerID].push(card);
	}

	//finds index of given ID inefficiently
	//splice removes 1 at a given index
	//fails silently if card isn't found, which should never happen
	this.removeFromHand = function(playerID, cardID){
		for(var i=0; i<this.hands[playerID].length; i++){
			if(this.hands[playerID][i].id == cardID){
				this.hands[playerID].splice(i, 1); //it's called splice? weird huh?
			}
		}
	}

	this.giveDealerTrump = function(){
		this.hands[this.dealerID].push(this.trumpCandidate);
	}

	this.resetHands = function(){
		this.hands = new Array(4);
		for(var i=0; i<4; i++){
			this.hands[i] = new Array(5);
		}
		this.getShuffledDeck();
	}
}






