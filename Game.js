/***********
 *Game class
 ***********/

function Game(){
	//initialize some properties
	this.deck = [];
	this.deckSize = 24;
	this.hands = new Array(4);
	for(var i=0; i<4; i++){
			this.hands[i] = new Array(5);
		}
	
	this.trumpCandidate = "";
	this.trump = "";
	this.currentPlayer = "";
	this.dealer = 0;
	this.dealerName = "South";
	this.maker = "";
	this.alonePlayer = "";
	
	this.nsScore = 0; //north south
	this.weScore = 0; //west east
	
	this.handHistory = [];

	getStyleSheet();
	

	//functions start
	this.startNewGame = function(){
		this.getShuffledDeck();
		this.pickDealer();
		this.dealHands();
	}

	this.pickDealer = function(){
		this.dealer = 0;
		this.dealerName = "South";
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

	this.dealHands = function(){
		var player, playerNames, cardNum, card;
		playerNames = ["South", "West", "North", "East"];

		placeDeck(this.dealerName);

		for(var i=0; i<20; i++){
			player = (i+this.dealer)%4;
			
			cardNum = Math.floor(i/4);
			card = this.deck.pop();
			this.hands[player][cardNum] = card;

			setTimeout(animateDeal, i*150, this.dealerName, playerNames[player], card.id, cardNum);
		}
	}
}

/***********
 *Sweet functions
 ***********/

/***********
 *Hella animations
 ***********/

var ss; //our style sheet

function getStyleSheet(){
	ss = document.getElementById("style").sheet;
}

function placeDeck(dealer){
	card = document.createElement("div");
	card.className = "card cardBack dealer" + dealer;
	document.getElementById("cardsContainer").appendChild(card);
}

//dealer and player are the names of the dealer/player
function animateDeal(dealer, player, cardId, cardNum){
	//create card
	var card, destination;

	card = document.createElement("div");
	card.className = "card cardBack dealer" + dealer;
	card.id = cardId;

	document.getElementById("cardsContainer").appendChild(card);

	card.classList.add("move" + player);
	if (player == "South"){
		flipCard(card);
	}
}

function flipCard(card){
	card.classList.remove("cardBack");
}

function test(){
}







