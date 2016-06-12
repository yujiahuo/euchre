/*****************************************************************************
 * Global constants
 *****************************************************************************/

//the game being played
var game;

//enum of players
var players = {
	NONE: -1,
	SOUTH: 0,
	WEST: 1,
	NORTH: 2,
	EAST: 3,

	props: {
		0: {"name": "South", "partner": 2},
		1: {"name": "West", "partner": 3},
		2: {"name": "North", "partner": 0},
		3: {"name": "East", "partner": 1},
	},
}

//enum of suits
var suits = {
	CLUBS: "C",
	DIAMONDS: "D",
	HEARTS: "H",
	SPADES: "S",

	props: {
		"C": {"name": "Clubs", "opposite": "S"},
		"D": {"name": "Diamonds", "opposite": "H"},
		"H": {"name": "Hearts", "opposite": "D"},
		"S": {"name": "Spades", "opposite": "C"},
	},
};

//enum of ranks
var ranks = {
	NINE: 9,
	TEN: 10,
	JACK: 11,
	QUEEN: 12,
	KING: 13,
	ACE: 14,
	LEFT: 15,
	RIGHT: 16,
};

var DECKSIZE = 24;

//sorted deck of cards
//we create all the card objects used here
var SORTEDDECK = [];
for(var suit in suits){
	if(suit==="props") continue;
	for(var rank in ranks){
		if(rank==="LEFT" || rank==="RIGHT") continue;
		SORTEDDECK.push(new Card(suits[suit], ranks[rank]));
	}
}
//dictionary of cards, keyed by card ID
//points to the cards we made for the sorted deck
var DECKDICT = [];
for(var i=0; i<SORTEDDECK.length; i++){
	DECKDICT[SORTEDDECK[i].id] = SORTEDDECK[i];
}

var zIndex = 0; //iterated to make sure recently moved cards end up on top

/*****************************************************************************
 *Card object
 *****************************************************************************/

function Card(suit, rank, id){
	this.suit = suit;
	this.rank = rank;
	if(id){
		this.id = id;
	}
	else{
		this.id = suit + rank;
	}
}

/*****************************************************************************
 * Game object
 *****************************************************************************/

function Game(){
    //#region Private variables

	//game
	var __deck; //contains the shuffled deck or what's left of it after dealing

	//bidding
	var __isBidding = false; //are we currently bidding?
	var __biddingRound = 0; //round 1 or 2 of bidding, 0 when not bidding
	var __playersBid = 0; //number of players who have bid so far

	//hand
	var __hands; //2d array of everyone's hands
	var __nsScore = 0; //north south
	var __ewScore = 0; //east west
	var __handNum = 0; //what hand number we're on
	var __trumpCandidate; //turned up card
	var __trump;	//current trump suit
	var __rightID; //ID of right bower (not affected by change in rank)
	var __leftID; //ID of left bower (not affected by change in rank)
	var __dealer = players.NONE;
	var __maker; //player who called trump
	var __alonePlayer = players.NONE;
	var __numPlayers = 4; //this is usually 4 but can be 3 or 2 depending on loners

	//trick
	var __trickNum = 0; //what trick we're on
	var __trickPlayersPlayed = 0; //how many players have played this trick
	var __trickSuit; //the suit that was lead
	var __trickPlayedCards = [null, null, null, null]; //array of cards that have been played this trick so far
	var __currentPlayer = players.NONE;
	var __nsTricksWon = 0;
	var __ewTricksWon = 0;

	//settings
	var __sound;
	var __openHands;
	var __defendAlong;
	var __noTrump;
	var __showTrickHistory;

	var __statMode;
	var __aiPlayers = [null, null, null, null];
    //#endregion

    //#region Get functions
	this.getIsBidding = function(){
		return __isBidding;
	}
	this.getBiddingRound = function(){
		return __biddingRound;
	}
	this.getPlayersBid = function(){
		return __playersBid;
	}
	this.getNsScore = function(){
		return __nsScore;
	}
	this.getEwScore = function(){
		return __ewScore;
	}
	this.getHandNum = function(){
		return __handNum;
	}
	this.getTrumpCandidate = function(){
		var card;

		card = new Card(__trumpCandidate.suit, __trumpCandidate.rank, __trumpCandidate.id);
		return card;
	}
	this.getTrump = function(){
		return __trump;
	}
	this.getRightID = function(){
		return __rightID;
	}
	this.getLeftID = function(){
		return __leftID;
	}
	this.getDealer = function(){
		return __dealer;
	}
	this.getMaker = function(){
		return __maker;
	}
	this.getAlonePlayer = function(){
		return __alonePlayer;
	}
	this.getNumPlayers = function(){
		return __numPlayers;
	}
	this.getTrickNum = function(){
		return __trickNum;
	}
	this.getTrickPlayersPlayed = function(){
		return __trickPlayersPlayed;
	}
	this.getTrickSuit = function(){
		return __trickSuit;
	}
	this.getTrickPlayedCards = function(){
		var playedCards = [];
		var card;

		for(var i=0; i<__trickPlayedCards.length; i++){
			card = __trickPlayedCards[i];
			if(card === null){
				playedCards[i] = null;
			}
			else{
				playedCards[i] = new Card(card.suit, card.rank, card.id);
			}
		}
		return playedCards;
	}
	this.getCurrentPlayer = function(){
		return __currentPlayer;
	}
	this.getNsTricksWon = function(){
		return __nsTricksWon;
	}
	this.getEwTricksWon = function(){
		return __ewTricksWon;
	}
	this.isOpenHands = function(){
		return __openHands;
	}
	this.isStatMode = function(){
		return __statMode;
	}
	this.isAiPlayer = function(player){
		return (__aiPlayers[player] != null);
	}
	this.myHand = function(){
		var hand = [];
		var card;

		for(var i=0; i<__hands[__currentPlayer].length; i++){
			card = __hands[__currentPlayer][i];
			hand[i] = new Card(card.suit, card.rank, card.id);
		}

		return hand;
	}

    //#endregion

	/*******************************
 	* Private functions
 	********************************/
    //#region Setup
 	function grabSettings(){
		//checkbox settings
		__sound = document.getElementById("chkSound").checked;
		__openHands = document.getElementById("chkOpenHands").checked;
		__defendAlong = document.getElementById("chkDefendAlone").checked;
		__noTrump = document.getElementById("chkNoTrump").checked;
		__showTrickHistory = document.getElementById("chkShowHistory").checked;

		//ai settings
		__statMode = document.getElementById("chkStatMode").checked;; //4 AIs play against each other
		__aiPlayers = [null, new DecentAI(), new DecentAI(), new DecentAI()];
 	}


    //#endregion

	//The beginning of a hand. A hand involves picking a dealer,
	//bidding, and playing until someone wins the hand.
	function newHand(redealing){
		var i;

		disableActions();

		if(!redealing){
			__handNum = __handNum + 1;
		}

		__deck = [];
		__hands = new Array(4);
		for(i=0; i<4; i++){
			__hands[i] = new Array(5);
		}

		__isBidding = true;
		__biddingRound = 1;
		__playersBid = 0;

		__trumpCandidate = "";
		__trump = "";
		__dealer = players.NONE;
		__alonePlayer = players.NONE;
		__numPlayers = 4;

		__nsTricksWon = 0;
		__ewTricksWon = 0;

		pickDealer();

		//animShowText("", 1); //clear div
		animDisableBidding();
		animClearTable();

		getShuffledDeck();
		dealHands();

		for(i=0; i<4; i++){
			__currentPlayer = i;
			if(__aiPlayers[i] !== null){
				__aiPlayers[i].init();
			}
		}

		__currentPlayer = __dealer;
		nextPlayer();

		animShowText("Bidding");
		if(__statMode) doBidding();
		else setTimeout(doBidding, 3000);
	}

    //EXTRACT
	function pickDealer(){
		//if we have a dealer, get the next dealer
		if(__dealer !== players.NONE){
			__dealer = (__dealer+1)%4;
		}
		//otherwise just randomly grab one
		else{
			__dealer = Math.floor(Math.random() * 4);
		}
		animPlaceDealerButt();
	}

    //EXTRACT
	function getShuffledDeck(){
		var pos,temp,size;
		size = SORTEDDECK.length;

		__deck = [];
		for(var i=0; i<size; i++){
			__deck.splice(Math.floor(Math.random() * (i+1)), 0, SORTEDDECK[i]);
		}
	}

	function dealHands(){
		var player, cardPos, card;

		for(var i=0; i<20; i++){
			player = (__dealer+i)%4;

			cardPos = Math.floor(i/4);
			card = __deck.pop();
			__hands[player][cardPos] = card;
		}

		__trumpCandidate = __deck.pop();

		animDeal(__hands);
		setTimeout(animFlipCard, 1500, __trumpCandidate.id);
		if(__aiPlayers[players.SOUTH] === null){
			setTimeout(animSortHand, 1500, __hands[0]);
		}
	}

	function doBidding(){
		//a bidding round has ended without any bids
		if(__playersBid === 4){
			if(__biddingRound === 1){
				animShowText("Starting bidding round 2");
				__biddingRound = 2;
				__playersBid = 0;

				animFlipCard(__trumpCandidate.id);
			}
			else{
				animShowText("Redealing");
				if(__statMode) newHand(true);
				else setTimeout(newHand, 1000, true);
				return;
			}
		}
		//ongoing round
		getBid(__aiPlayers[__currentPlayer]);
	}

	function getBid(ai){
		var bidSuit;
		var doneBidding;

		//let human player take action
		if(ai === null){
			animEnableBidding();
			return;
		}

		if(__biddingRound === 1){
			if(ai.chooseOrderUp()){
				doneBidding = orderUp();
			}
		}
		else if(__biddingRound === 2){
			bidSuit = ai.pickTrump();
			doneBidding = callTrump(bidSuit);
		}

		if(doneBidding){
			
			startTricks();
		}
		else{
			animShowText("Player " + __currentPlayer + " passed", 1);
			__playersBid += 1;
			nextPlayer();
			if(__statMode) doBidding();
			else setTimeout(doBidding, 1000);
		}
	}

	function goAlone(player){
		__numPlayers -= 1;
	}

	function orderUp(){
		var ai;
		var card;
		var currentPlayer = __currentPlayer;

		if(!canOrderUpSuit(__trumpCandidate.suit)) return false;
		setTrump(__trumpCandidate.suit);

		ai = __aiPlayers[__dealer];
		__currentPlayer = __dealer;

		if(ai === null){
			animShowText("Discard a card", 1);
			//wait for player to select a card to discard
			enableActions();
			return true;
		}
		else{
			card = ai.pickDiscard();
			if(card == null){
				card = __hands[__dealer][0];
			}
			giveDealerTrump(card);
		}

		__currentPlayer = currentPlayer;
		animShowText(players.props[__currentPlayer].name + " ordered up " + __trumpCandidate.suit, 1);
		startTricks();
		return true;
	}

	function callTrump(trumpSuit){
		var ai;

		if(trumpSuit === null || !canOrderUpSuit(trumpSuit)) return false;

		animShowText(players.props[__currentPlayer].name + " called trump: " + trumpSuit, 1);
		ai = __aiPlayers[__currentPlayer];
		if(ai !== null){
			if(ai.chooseGoAlone()){
				goAlone(__currentPlayer);
			}
		}
		setTrump(trumpSuit);
		return true;
	}

	function setTrump(suit){
		__trump = suit;
		__rightID = __trump + ranks.JACK;
		DECKDICT[__rightID].rank = ranks.RIGHT;
		//left temporarily becomes trump suit. IDs don't change, just suit and rank
		//the html elem id will NOT change
		__leftID = getOppositeSuit(__trump) + ranks.JACK;
		DECKDICT[__leftID].suit = __trump;
		DECKDICT[__leftID].rank = ranks.LEFT;

		__maker = __currentPlayer;
		if(__alonePlayer !== players.NONE){
			goAlone(__alonePlayer);
		}

		animShowTextTop("Trump is "+ __trump, true);
		animShowTextTop("Maker is " + __maker);
	}

	function giveDealerTrump(toDiscard){
		addToHand(__dealer, __trumpCandidate);
		removeFromHand(__dealer, toDiscard);

		animTakeTrump(toDiscard.id);

		if(__aiPlayers[__dealer] === null){
			document.getElementById(__trumpCandidate.id).addEventListener("click", game.clickCard);
		}
	}

 	function endHand(){
		DECKDICT[__rightID].rank = ranks.JACK;
		DECKDICT[__leftID].suit = getOppositeSuit(DECKDICT[__leftID].suit);
		DECKDICT[__leftID].rank = ranks.JACK;
		updateScore();
		if(__nsScore >= 10) endGame(true);
		else if(__ewScore >= 10) endGame(false);
		else newHand();
	}

	//end of bidding phase and start of trick playing
	function startTricks(){
		animShowText("Playing hand");
		__trickNum = 1;
		__nsTricksWOn = 0;
		__weTricksWon = 0;
		__currentPlayer = __dealer;
		nextPlayer();
		__isBidding = false;
		initNewTrick();

		animRemoveKitty();
		if(__alonePlayer !== players.NONE){
			animShowTextTop(__alonePlayer + " is going alone ");
			animHidePartnerHand(__hands);
		}

		if(__statMode){
			playTrick();
		}
		else{
			setTimeout(animSortHand, 600, __hands[0]);
			animShowText("Trick " + __trickNum, 1);
			if(__statMode) playTrick();
			else setTimeout(playTrick, 1000);
		}
	}

	//called before every trick
	function initNewTrick(){
		__trickPlayersPlayed = 0;
		__trickSuit = "";
		__trickPlayedCards = [null, null, null, null];
	}

	//plays a single trick
	function playTrick(){
		var card;
		var ai;

		//everyone has played
		if(__trickPlayersPlayed === __numPlayers){
			endTrick();

			//all tricks have been played
			if(__trickNum === 5){
				endHand();
				return;
			}
			else{
				initNewTrick();
				__trickNum++;
				animShowText("Trick " + __trickNum, 1);
				if(__statMode) playTrick;
				else setTimeout(playTrick, 1000);
				return;
			}
		}

		ai = __aiPlayers[__currentPlayer];

		if(__alonePlayer !== players.NONE){
			if(__currentPlayer === players.props[__alonePlayer].partner){
				nextPlayer();
				playTrick();
				return;
			}
		}

		if(ai === null){
			enableActions();
		}
		else{
			card = ai.pickCard();
			if(!isValidPlay(card)){
				card = autoPickCard();
			}
			playCard(card);
			nextPlayer();
			setTimeout(playTrick, 1000);
		}
	}

	//your AI sucks and didn't pick a valid card
	function autoPickCard(){
		var hand;

		console.log("*** AI tried to pick a card it can't play.");

		hand = __hands[__currentPlayer];
		for(var i=0; i<hand.length; i++){
			if(isValidPlay(hand[i])){
				return hand[i];
			}
		}
		//we will never reach this but just in case
		return hand[0];
	}

	function playCard(card){
		var flipCard;

		flipCard = (__aiPlayers[__currentPlayer] !== null); //flip card for AIs

		if(__trickPlayersPlayed === 0){
			__trickSuit = card.suit;
		}
		__trickPlayedCards[__currentPlayer] = card;
		removeFromHand(__currentPlayer, card);
		__trickPlayersPlayed++;

		animPlayCard(__currentPlayer, card.id, flipCard);
		animShowText(players.props[__currentPlayer].name + " played " + card.id, 2);
	}

	function endTrick(){
		var winner;

		winner = getTrickWinner();
		if(winner===players.SOUTH || winner===players.NORTH) __nsTricksWon += 1;
		if(winner===players.WEST || winner===players.EAST) __ewTricksWon += 1;

		animShowText(winner + " takes the trick - " + __nsTricksWon + " : " + __ewTricksWon);

		__currentPlayer = winner;
		animWinTrick(winner, __trickPlayedCards);
	}

	//returns winning player
	function getTrickWinner(){
		var winner;
		var winningCard;

		winningCard = __trickPlayedCards[players.SOUTH];
		winner = players.SOUTH;
		for(var i=1; i<4; i++){
			if(__trickPlayedCards[i] === null) continue;
			if(isGreater(winningCard, __trickPlayedCards[i])){
				winner = i;
				winningCard = __trickPlayedCards[i];
			}
		}
		return winner;
	}


	function updateScore(){
		if(__nsTricksWon > __ewTricksWon){
			//gain at least one point
			__nsScore++;
			if(__nsTricksWon === 5){
				//one more for having all the tricks
				__nsScore++;
				//two more for going alone and making it
				if(__alonePlayer === players.SOUTH || __alonePlayer === players.NORTH){
					__nsScore += 2;
				}
			}
			if(!__nsTricksWon === 5 && __maker === players.EAST || __maker === players.WEST){
				__nsScore++;
				//defend alone same logic as alone player
			}

			animShowScore();
		}
		else if(__ewTricksWon > __nsTricksWon){
			//gain at least one point
			__ewScore++;
			if(__ewTricksWon === 5){
				//one more for having all the tricks
				__ewScore++;
				//two more for going alone and making it
				if(__alonePlayer === players.EAST || __alonePlayer === players.WEST){
					__ewScore += 2;
				}
			}
			if(!__ewTricksWon === 5 && __maker === players.NORTH || __maker === players.SOUTH){
				__ewScore++;
				//defend alone same logic as alone player
			}

			animShowScore();
		}
		else{
			console.log("something went horribly wrong with scoring");
		}
	}

	function endGame(won){
		if(won){
			animShowText("You win");
		}
		else{
			animShowText("Loser.");
		}
		game.start();
	}

	/*******************************
 	* Nice utilities
 	********************************/

	function nextPlayer(){
		__currentPlayer = (__currentPlayer+1)%4;
	}

	function addToHand(player, card){
		__hands[player].push(card);
	}

	//finds index of given ID inefficiently
	//splice removes 1 at a given index
	//fails silently if card isn't found, which should never happen
	function removeFromHand(player, card){
		var cardID = card.id;

		for(var i=0; i<__hands[player].length; i++){
			if(__hands[player][i].id === cardID){
				__hands[player].splice(i, 1);
			}
		}
	}

	/*******************************
 	* Public functions
 	********************************/

 	this.start = function(){
 		grabSettings();
 		newHand(false);
 	}

 	this.clickOrderUp = function(){
		orderUp();
		animDisableBidding();
	}

	this.clickTrump = function(suit){
		callTrump(suit);
		animDisableBidding();
		startTricks();
	}

	this.clickPass = function(){
		nextPlayer();
		__playersBid++;
		animDisableBidding();
		animShowText("You passed", 1);
		if(__statMode) doBidding();
		else setTimeout(doBidding, 1000);
	}

	this.clickGoAlone = function(){
		if(__alonePlayer === players.NONE){
			__alonePlayer = players.SOUTH;
			animFlipButton(true);
		}
		else{
			__alonePlayer = players.NONE;
			animFlipButton(false);
		}
	}

	this.clickCard = function(){
		var card;

		card = DECKDICT[this.id];

		disableActions();

		if(__isBidding){
			giveDealerTrump(card);
			startTricks();
			return;
		}

		if(!isValidPlay(card)){
			enableActions();
			console.log("No. You can't play that. The suit is " + __trickSuit);
			return;
		}
		playCard(card);
		nextPlayer();

		setTimeout(playTrick, 1000);
	}
}
