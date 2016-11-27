/******************************************************
/* Functions AIs have to implement
/* 
/* You may call functions from playerAPI.js
/* All other functions and vars are "private"
*******************************************************/

interface playedCard {
	player: Player;
	card: Card;
}

interface EuchreAI{
	//Called once hands have been dealt and the trump candidate is revealed
	//Params: none
	//Returns: none
    init(): void;

	//Bidding round 1, choose whether to order up or pass
	//Params: none
	//Returns: boolean
    chooseOrderUp(): boolean;

	//Bidding round 1, if trump is ordered up to you, pick a card to discard
	//Params: none
	//Returns: Card or null
    pickDiscard(): Card;

	//Bidding round 2, choose from the remaining suits or pass
	//Params: none
	//Returns: Suit or null
    pickTrump(): Suit;

	//Called at any bidding round after you've determined trump
	//Return true if going alone
	//Params: none
	//Returns: boolean
    chooseGoAlone(): boolean;

	//Your turn to play a card
	//Params: none
	//Returns: Card or null
    pickCard(): Card;

	//Called at the end of each trick
	//Params: An array of players and the cards they played, in play order
	//Returns: none
	trickEnd(cardsPlayed: playedCard[]): void
}