/******************************************************
/* Functions AIs have to implement
/*
/* You may call functions from playerAPI.js
/* All other functions and vars are "private"
*******************************************************/

interface BiddingAI {
	//Called at the beginning of each hand
	init(me: Player): void;

	//Bidding round 1, choose whether to order up or pass
	//Hand is unmodified from deal
	chooseOrderUp(hand: Card[], trumpCandidate: Card, dealer: Player): boolean;

	//Bidding round 2, choose from the remaining suits or pass
	//Hand is unmodified from deal
	pickTrump(hand: Card[], trumpCandidate: Card): Suit | null;

	//Called in either bidding round after you've determined trump
	//Hand is updated (6 cards):
	//- Jacks have become left/right
	//- Trump candidate is in hand if you're the dealer
	//- No discard yet (called before pickDiscard)
	chooseGoAlone(hand: Card[], trump: Suit): boolean;

	//Bidding round 1, if trump is ordered up to you, pick a card to discard
	//Hand is updated (6 cards):
	//- Jacks have become left/right
	//- Trump candidate is in hand if you're the dealer
	pickDiscard(hand: Card[], trump: Suit): Card | null;
}

interface PlayingAI {
	//Called at the beginning of each hand
	init(me: Player): void;

	//Your turn to play a card
	pickCard(hand: Card[], maker: Player, trump: Suit, trickSoFar: PlayedCard[]): Card | null;

	//Called when the trick is over
	trickEnd(playedCardsCallback: () => PlayedCard[]): void;
}

interface EuchreAI extends BiddingAI, PlayingAI { }