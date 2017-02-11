class Trick {
	private __suitLead: Suit = null; //the suit that was lead
	private __playedCards: PlayedCard[] = []; //array of cards that have been played this trick so far
	private __trumpSuit: Suit = null; //set in constructor
	private __alone: boolean = false; //set in constructor

	/* Properties */
	public playersPlayed(): number {
		return this.__playedCards.length;
	}
	public suitLead(): Suit {
		return this.__suitLead;
	}
	public cardsPlayed(): PlayedCard[] {
		let playedCards: PlayedCard[] = [];
		let card: Card;
		let cardCopy: Card;

		for (let i = 0; i < this.__playedCards.length; i++) {
			card = this.__playedCards[i].card;

			//make deep copy of cards
			cardCopy = new Card(card.suit, card.rank);
			playedCards.push({ player: this.__playedCards[i].player, card: cardCopy });
		}
		return playedCards;
	}

	/* constructor */
	constructor(trumpSuit: Suit, alone: boolean) {
		this.__trumpSuit = trumpSuit;
		this.__alone = alone;
	}

	/* Private functions */
	private playCard(hand: Card[], card: Card, player: Player): void {
		if (this.isFinished()) return;

		if (!isInHand(hand, card) || !isValidPlay(hand, card, this.__suitLead)) {
			card = getFirstLegalCard(hand, this.__suitLead);
		}
		this.__playedCards.push({ player: player, card: card });
	}

	/* Public functions */
	public isFinished(): boolean {
		if (this.__alone) return this.__playedCards.length >= 4;
		else return this.__playedCards.length >= 3;
	}

	public winner(): Team {
		let winningPlayer: Player;

		winningPlayer = getBestCardPlayed(this.__playedCards, this.__trumpSuit).player;
		return getTeam(winningPlayer);
	}
}