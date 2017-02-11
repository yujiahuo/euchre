class Trick {
	private __suitLead: Suit = null; //the suit that was lead
	private __playedCards: PlayedCard[] = []; //array of cards that have been played this trick so far
	private __trumpSuit: Suit = null; //set in constructor
	private __alone: boolean = false; //set in constructor
	private __hands: Card[][];
	private __aiPlayers: EuchreAI[];

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
	constructor(trumpSuit: Suit, alone: boolean, hands: Card[][], aiPlayers: EuchreAI[]) {
		this.__trumpSuit = trumpSuit;
		this.__alone = alone;
		this.__hands = hands;
		this.__aiPlayers = aiPlayers;
	}

	/* Private functions */
	private playCard(player: Player, card: Card): void {
		let hand: Card[] = this.__hands[player];

		if (this.isFinished()) return;

		if (!isInHand(hand, card) || !isValidPlay(hand, card, this.__suitLead)) {
			card = getFirstLegalCard(hand, this.__suitLead);
		}
		this.__playedCards.push({ player: player, card: card });

		animShowText(Player[player] + " played " + card.id, MessageLevel.Step, 1);
	}

	/* Public functions */
	public playTrickStep(player: Player): void {
		let card: Card;
		let hand: Card[] = this.__hands[player];

		if (this.isFinished()) return;


		card = this.__aiPlayers[player].pickCard();

		if (!isInHand(hand, card) || !isValidPlay(hand, card, this.__suitLead)) {
			card = getFirstLegalCard(hand, this.__suitLead);
		}
		this.playCard(player, card);
	}

	public isFinished(): boolean {
		if (this.__alone) return this.__playedCards.length >= 4;
		else return this.__playedCards.length >= 3;
	}

	public winningTeam(): Team {
		let winningPlayer: Player;

		winningPlayer = getBestCardPlayed(this.__playedCards, this.__trumpSuit).player;
		return getTeam(winningPlayer);
	}

	public winner(): Player {
		return getBestCardPlayed(this.__playedCards, this.__trumpSuit).player;
	}
}