/******************************************************
/* Functions AIs have to implement
/*
/* You may call functions from playerAPI.js
*******************************************************/

function DecentAI(){
	var hand;
	var handStrength;

	//Called once hands have been dealt and the trump candidate is revealed
	//Params: none
	//Returns: none
	this.init = function(){
		hand = game.myHand();
	}

	//Bidding round 1, choose whether to order up or pass
	//Params: none
	//Returns: bool
	this.chooseOrderUp = function(){
		handStrength = this.calculateHandStrength(game.getTrumpCandidate().suit);
		if(handStrength > 2) return true;
		return false;
	}

	//Bidding round 1, if trump is ordered up to you, pick a card to discard
	//Params: none
	//Returns: card obj
	this.pickDiscard = function(){
		return getWorstCard();
	}

	//Bidding round 2, choose from the remaining suits or pass
	//Params: none
	//Returns: suit or null
	this.pickTrump = function(){
		if(game.getTrumpCandidate().suit !== suits.CLUBS){
			handStrength = this.calculateHandStrength(suits.CLUBS);
			if(handStrength > 2) return suits.CLUBS;
		}

		if(game.getTrumpCandidate().suit !== suits.DIAMONDS){
			handStrength = this.calculateHandStrength(suits.DIAMONDS);
			if(handStrength > 2) return suits.DIAMONDS;
		}

		if(game.getTrumpCandidate().suit !== suits.SPADES){
			handStrength = this.calculateHandStrength(suits.SPADES);
			if(handStrength > 2) return suits.SPADES;
		}

		if(game.getTrumpCandidate().suit !== suits.HEARTS){
			handStrength = this.calculateHandStrength(suits.HEARTS);
			if(handStrength > 2) return suits.HEARTS;
		}

		return null;
	}

	//Called at any bidding round after you've determined trump
	//Return true if going alone
	//Params: none
	//Returns: bool
	this.chooseGoAlone = function(){
		if(handStrength > 150) return true;
		return false;
	}

	//Your turn to play a card
	//Params: none
	//Returns: card
	/*Play style:
		- Will play the the lowest card that can
		  beat all cards played so far
		- If last player and partner is winning, sluff
	*/
	this.pickCard = function(){
		var numPlayersPlayed;
		var playedCards;
		var lowestWinningCard = null;
		var lowestWinningValue = 1000;
		var winningValue = 0;
		var value;
		var i;

		hand = game.myHand(); //you need to do this or else

		numPlayersPlayed = game.getTrickPlayersPlayed();
		if(numPlayersPlayed === 0){
			return getBestCard();
		}

		playedCards = game.getTrickPlayedCards();
		//Find currently winning value
		for(i=0; i<playedCards.length; i++){
			if(playedCards[i] === null) continue;
			value = getCardValue(playedCards[i]);
			if(value > winningValue){
				winningValue = value;
			}
		}

		//I'm the last player
		if(numPlayersPlayed === 3){
			//if partner is winning, sluff
			//Implement later
		}

		//If not last player, play the lowest card that can win
		//If we can't win, then sluff
		for(i=0; i<hand.length; i++){
			if(!isValidPlay(hand[i])) continue;
			value = getCardValue(hand[i]);
			if(value > winningValue){
				if(value < lowestWinningValue){
					lowestWinningCard = hand[i];
					lowestWinningValue = value;
				}
			}
		}

		if(lowestWinningCard){
			return lowestWinningCard;
		}
		else{
			return getWorstCard(true);
		}
	}

	//Whatever just count trump
	this.calculateHandStrength = function(trumpSuit){
		var smartlyCalculatedValue;

		smartlyCalculatedValue = numCardsOfSuit(trumpSuit);
		if(this.theyHaveTheLeft(trumpSuit)){
			smartlyCalculatedValue++;
		}

		//just number of trump you're holding yay
		return smartlyCalculatedValue;
	}

	this.theyHaveTheLeft = function(trumpSuit){
		for(var i=0; i<hand.length; i++){
			if(hand[i].rank === ranks.JACK
				&& hand[i].suit === getOppositeSuit(trumpSuit)){
				return true;
			}
		}
		return false;
	}
}
