class Trick {
	private __suitLead: Suit | undefined = undefined; //the suit that was lead
	private __playedCards: PlayedCard[] = []; //array of cards that have been played this trick so far
	private __trumpSuit: Suit; //set in constructor
	private __alone: boolean = false; //set in constructor
	private __hands: Card[][];
	private __aiPlayers: (EuchreAI | null)[];

	/* Properties */
	public playersPlayed(): number {
		return this.__playedCards.length;
	}
	public suitLead(): Suit | undefined {
		return this.__suitLead;
	}
	public cardsPlayed(): PlayedCard[] {
		let playedCards: PlayedCard[] = [];

		for (let i = 0; i < this.__playedCards.length; i++) {
			let card = this.__playedCards[i].card;
			let player = this.__playedCards[i].player;

			//make deep copy of cards
			playedCards.push({ player: player, card: new Card(card) });
		}
		return playedCards;
	}

	/* constructor */
	constructor(trumpSuit: Suit, alone: boolean, hands: Card[][], aiPlayers: (EuchreAI | null)[]) {
		this.__trumpSuit = trumpSuit;
		this.__alone = alone;
		this.__hands = hands;
		this.__aiPlayers = aiPlayers;
	}

	/* Private functions */
	private playCard(player: Player, card: Card): void {
		if (this.isFinished()) return;
		this.__playedCards.push({ player: player, card: card });

		animShowText(Player[player] + " played " + card.id, MessageLevel.Step, 1);
	}

	/* Public functions */
	public playTrickStep(player: Player, card: Card | null): Card {
		let hand: Card[] = this.__hands[player];

		if (!card || !isInHand(hand, card) || !isValidPlay(hand, card, this.__suitLead)) {
			card = getFirstLegalCard(hand, this.__suitLead) as Card;
		}

		if (this.__playedCards.length === 0) {
			this.__suitLead = card.suit;
		}
		this.playCard(player, card);

		return card;
	}

	public isFinished(): boolean {
		if (!this.__alone) return this.__playedCards.length >= 4;
		else return this.__playedCards.length >= 3;
	}

	public winningTeam(): Team | null {
		let winner = this.winner();
		if (winner === null) {
			return null;
		}

		return getTeam(winner);
	}

	public winner(): Player | null {
		let bestCardPlayed = getBestCardPlayed(this.__playedCards, this.__trumpSuit);
		if (!bestCardPlayed) {
			return null;
		}

		return bestCardPlayed.player;
	}
}