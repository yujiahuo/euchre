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
	
	this.trumpCandidate;
	this.trump = "";
	this.currentPlayer = "";
	this.dealer = 0;
	this.dealerName = "South";
	this.maker = "";
	this.alonePlayer = "";
	
	this.nsScore = 0; //north south
	this.weScore = 0; //west east
	
	this.handHistory = [];

	//functions start
	this.startNewGame = function(){
		this.getShuffledDeck();
		this.pickDealer();
		this.dealHands();
		doBidding();
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

			setTimeout(animDeal, i*100, this.dealerName, playerNames[player], card.id, cardNum);
		}

		this.trumpCandidate = this.deck.pop();
		setTimeout(animFlipTrump, 2100, this.dealerName, this.trumpCandidate.id);
	}
}

/***********
 *Sweet functions
 ***********/

/***********
 *Hella animations
 ***********/

function placeDeck(dealer){
	card = document.createElement("div");
	card.className = "card cardBack dealer" + dealer;
	document.getElementById("cardsContainer").appendChild(card);
}

function getCardElem(dealer, cardId, flippedUp){
	var card;

	card = document.createElement("div");
	card.className = "card dealer" + dealer;
	if(!flippedUp){
		card.classList.add("cardBack");
	}
	card.id = cardId;

	document.getElementById("cardsContainer").appendChild(card);

	return card;
}

//dealer and player are the names of the dealer/player
function animDeal(dealer, player, cardId, cardNum){
	//create card
	var card, flippedUp;

	flippedUp = (player=="South");
	card = getCardElem(dealer, cardId, flippedUp);

	setTimeout(animDealToPlayer, 50, player, card, cardNum);
}

function animDealToPlayer(player, card, cardNum){
	switch(player){
		case "South":
			card.style.top = "450px";
			card.style.left = (cardNum*20)+(390) + "px";
			break;
		case "West":
			card.style.top = "250px";
			card.style.left = (cardNum*20)+(50) + "px";
			break;
		case "North":
			card.style.top = "50px";
			card.style.left = (cardNum*20)+(390) + "px";
			break;
		case "East":
			card.style.top = "250px";
			card.style.left = (cardNum*20)+(700) + "px";
			break;
	} 
}

//eventually do something fancier probably
function animFlipTrump(dealer, cardId){
	var card;

	card = getCardElem(dealer, cardId, true);
}




//////////////
//Testy stuff
//////////////
function test(){
	var card;

	card = document.createElement("div");
	card.className = "card cardBack";
	card.id = "SA";
	document.getElementById("cardsContainer").appendChild(card);

	setTimeout(test2, 1000);
}

function test2(){
	card = document.getElementById("SA");
	card.style.left = "300px";
}







