class Trick {
	private __suitLead: Suit | undefined = undefined; //the suit that was lead
	private __playedCards: PlayedCard[] = []; //array of cards that have been played this trick so far
	private __trump: Suit;
	private __alone: boolean;
	private __playerHands: Card[][];
	private __aiPlayers: (EuchreAI | null)[];
	private __currentPlayer: Player;

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
	public currentPlayer(): Player {
		return this.__currentPlayer;
	}

	/* constructor */
	constructor(trump: Suit, alone: boolean, hands: Card[][], aiPlayers: (EuchreAI | null)[], firstPlayer: Player) {
		this.__trump = trump;
		this.__alone = alone;
		this.__playerHands = hands;
		this.__aiPlayers = aiPlayers;
		this.__currentPlayer = firstPlayer;
	}

	protected advanceTrick(): void {
		let card: Card | null = null;
		let aiPlayer: EuchreAI | null = this.__aiPlayers[this.__currentPlayer];

		if (this.isFinished()) return;

		if (aiPlayer) {
			card = aiPlayer.pickCard();
		}
		this.playCard(card);
	}

	protected playCard(card: Card | null): Card | null {
		if (this.isFinished()) return null;

		let hand: Card[] = this.__playerHands[this.__currentPlayer];

		if (!card || !isInHand(hand, card) || !isValidPlay(hand, card, this.__suitLead)) {
			card = getFirstLegalCard(hand, this.__suitLead) as Card;
		}

		if (this.__playedCards.length === 0) {
			this.__suitLead = card.suit;
		}
		this.__playedCards.push({ player: this.__currentPlayer, card: card });
		this.removeFromHand(this.__currentPlayer, card)

		animShowText(Player[this.__currentPlayer] + " played " + card.id, MessageLevel.Step, 1);

		this.__currentPlayer = nextPlayer(this.__currentPlayer);

		return card;
	}

	private removeFromHand(player: Player, card: Card): void {
		let cardID = card.id;

		//TODO: do for x of y
		for (let i = 0; i < this.__playerHands[player].length; i++) {
			if (this.__playerHands[player][i].id === cardID) {
				this.__playerHands[player].splice(i, 1);
			}
		}
	}

	/* Public functions */
	public doTrick(): boolean {
		while (!this.isFinished()) {
			this.advanceTrick();
		}
		return true;
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
		let bestCardPlayed = getBestCardPlayed(this.__playedCards, this.__trump);
		if (!bestCardPlayed) {
			return null;
		}

		return bestCardPlayed.player;
	}
}