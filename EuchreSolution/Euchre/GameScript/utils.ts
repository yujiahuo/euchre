//**NOT TESTING**
function nextPlayer(currentPlayer: Player): Player {
	switch (currentPlayer) {
		case Player.South:
			return Player.West;
		case Player.West:
			return Player.North;
		case Player.North:
			return Player.East;
		case Player.East:
			return Player.South;
		default:
			return null;
	}
}

//**NOT TESTING**
function getPartner(player: Player): Player {
	switch (player) {
		case Player.South:
			return Player.North;
		case Player.West:
			return Player.East;
		case Player.North:
			return Player.South;
		case Player.East:
			return Player.West;
		default:
			return null;
	}
}

//**NOT TESTING**
function getOppositeSuit(suit: Suit): Suit {
	switch (suit) {
		case Suit.Clubs:
			return Suit.Spades;
		case Suit.Diamonds:
			return Suit.Hearts;
		case Suit.Hearts:
			return Suit.Diamonds;
		case Suit.Spades:
			return Suit.Clubs;
	}
}

//**TESTED**
function getDealer(prevDealer?: Player): Player {
	let dealer;

	//if we have a dealer, get the next dealer
	if (prevDealer !== undefined) {
		dealer = nextPlayer(prevDealer);
	}
	//otherwise just randomly grab one
	else {
		dealer = Math.floor(Math.random() * 4);
	}
	return dealer;
}

//**TESTED**
function getShuffledDeck(): Card[] {
	let deck;
	let pos;
	let temp;
	let size;

	size = SORTEDDECK.length;
	deck = [];
	for (let i = 0; i < size; i++) {
		deck.splice(Math.floor(Math.random() * (i + 1)), 0, SORTEDDECK[i]);
	}

	return deck;
}

//**TESTED**
function dealHands(deck: Card[], hands: Card[][], dealer: Player): void {
	let player, cardPos, card;

	for (let i = 0; i < 20; i++) {
		player = (dealer + i) % 4;

		cardPos = Math.floor(i / 4);
		card = deck.pop();
		hands[player][cardPos] = card;
	}
}

//**NOT TESTING**
//returns: bid suit
function getAIBid(aiPlayer: EuchreAI, stage: GameStage): Suit {
	let bidSuit;

	if (stage === GameStage.BidRound1) { //bidding round 1
		if (aiPlayer.chooseOrderUp()) {
			return game.getTrumpCandidateCard().suit;
		}
	}
	else if (stage === GameStage.BidRound2) { //bidding round 2
		bidSuit = aiPlayer.pickTrump();
		if (bidSuit !== undefined) {
			return bidSuit;
		}
	}
	return null;
}

function calculatePointGain(tricksTaken: number, maker: boolean, alone: boolean, defendingAlone?: boolean): number {
	if (maker) {
		if (tricksTaken === 5) {
			return alone ? 4 : 2;
		}
		else {
			return 1;
		}
	}
	else {
		return alone && defendingAlone ? 4 : 2;
	}
}