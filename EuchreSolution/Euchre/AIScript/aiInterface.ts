/******************************************************
/* Functions AIs have to implement
/* 
/* You may call functions from playerAPI.js
/* All other functions and vars are "private"
*******************************************************/

interface BiddingAI {
	//Called once hands have been dealt and the trump candidate is revealed
	init(): void;

	//Bidding round 1, choose whether to order up or pass
	chooseOrderUp(): boolean;

	//Bidding round 1, if trump is ordered up to you, pick a card to discard
	pickDiscard(): Card | null;

	//Bidding round 2, choose from the remaining suits or pass
	pickTrump(): Suit | null;

	//Called at any bidding round after you've determined trump
	chooseGoAlone(): boolean;
}

interface PlayingAI {
	//Called once hands have been dealt and the trump candidate is revealed
	init(): void;

	//Your turn to play a card
	pickCard(): Card | null;

	//Called at the end of each trick
	trickEnd(): void;
}

interface EuchreAI extends BiddingAI, PlayingAI { }