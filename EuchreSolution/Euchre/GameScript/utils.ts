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
function getNextDealer(prevDealer?: Player): Player {
	let dealer;

	//if we have a dealer, get the next dealer
	if (prevDealer !== undefined) {
		dealer = nextPlayer(prevDealer);
	}
	//otherwise just randomly grab one
	else {
		dealer = rng.nextInRange(0, 3);
	}
	return dealer;
}

//**TESTED**
function getShuffledDeck(): Card[] {
	let deck: Card[] = [];

	for (let i = 0; i < DECKSIZE; i++) {
		let j = rng.nextInRange(0, i);
		if (j !== i) {
			deck[i] = deck[j];
		}
		deck[j] = new Card(SORTEDDECK[i]);
	}

	return deck;
}

//**TESTED**
function dealHands(deck: Card[], playerHands: Card[][], dealer: Player): void {
	for (let i = 0; i < 20; i++) {
		let player = (dealer + i) % 4;
		let cardPos = Math.floor(i / 4);
		playerHands[player][cardPos] = deck.pop() as Card;
	}
}

//function createHands(idArray: string[][]) {

//}

//function createHand(idArray: string[]) {
//	let hand: Card[][];
//	let id: string;
//	let suit: Suit;
//	let rank: Rank;

//	for (id of idArray) {

//	}

//}

//**NOT TESTING**
function getAIBid(currentPlayer: Player, aiPlayer: EuchreAI, stage: BidStage, trumpCandidate: Card): BidResult | null {
	let trump: Suit | null = null;

	if (stage === BidStage.Round1) {
		if (aiPlayer.chooseOrderUp()) {
			trump = trumpCandidate.suit;
		}
	}
	else if (stage === BidStage.Round2) {
		trump = aiPlayer.pickTrump();
	}

	if (trump === null) {
		return null;
	}

	return {
		trump: trump,
		maker: currentPlayer,
		alone: aiPlayer.chooseGoAlone(),
		stage: stage,
	}
}

function calculatePointGain(tricksTaken: number, maker: boolean, alone?: boolean, defendingAlone?: boolean): number {
	if (tricksTaken < 3) return 0;

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