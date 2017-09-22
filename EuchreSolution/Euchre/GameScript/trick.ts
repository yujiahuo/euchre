class Trick {
	private __suitLead: Suit | undefined = undefined; //the suit that was lead
	private __playedCards: PlayedCard[] = []; //array of cards that have been played this trick so far
	private __trump: Suit;
	private __alone: boolean;
	private __playerHands: Card[][];
	private __aiPlayers: (EuchreAI | null)[];
	private __maker: Player;
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

		for (let playedCard of this.__playedCards) {
			let card = playedCard.card;
			let player = playedCard.player;

			//make deep copy of cards
			playedCards.push({ player, card: new Card(card) });
		}
		return playedCards;
	}
	public currentPlayer(): Player {
		return this.__currentPlayer;
	}

	/* constructor */
	constructor(trump: Suit, alone: boolean, hands: Card[][],
		aiPlayers: (EuchreAI | null)[], maker: Player, firstPlayer: Player) {
		this.__trump = trump;
		this.__alone = alone;
		this.__playerHands = hands;
		this.__aiPlayers = aiPlayers;
		this.__maker = maker;
		this.__currentPlayer = firstPlayer;
	}

	private advanceTrick(): void {
		let card: Card | null = null;
		let aiPlayer: EuchreAI | null = this.__aiPlayers[this.__currentPlayer];

		if (aiPlayer) {
			let hand = this.__playerHands[this.__currentPlayer];
			card = aiPlayer.pickCard(copyHand(hand), this.__maker, this.__trump, this.cardsPlayed());
		} else {
			if (pauseForTrick(aiPlayer)) {
				return;
			}
			card = queuedHoomanCard;
			clearHoomanQueue();
		}
		this.playCard(card);
		if (this.isFinished()) {
			for (let ai of this.__aiPlayers) {
				if (ai) {
					ai.trickEnd(this.cardsPlayed);
				}
			}
		}
	}

	protected playCard(card: Card | null): Card | null {
		if (this.isFinished()) { return null; }

		let hand: Card[] = this.__playerHands[this.__currentPlayer];

		if (!card || !isInHand(hand, card) || !isValidPlay(hand, card, this.__suitLead)) {
			card = getFirstLegalCard(hand, this.__suitLead) as Card;
		}

		if (this.__playedCards.length === 0) {
			this.__suitLead = card.suit;
		}
		this.__playedCards.push({ player: this.__currentPlayer, card });
		this.removeFromHand(this.__currentPlayer, card);

		animShowText(Player[this.__currentPlayer] + " played " + card.id, MessageLevel.Step, 1);

		this.__currentPlayer = nextPlayer(this.__currentPlayer);
		if (this.__alone && this.__currentPlayer === getPartner(this.__maker)) {
			this.__currentPlayer = nextPlayer(this.__currentPlayer);
		}

		return card;
	}

	private removeFromHand(player: Player, card: Card): void {
		let cardID = card.id;

		for (let i = 0; i < this.__playerHands[player].length; i++) {
			if (this.__playerHands[player][i].id === cardID) {
				this.__playerHands[player].splice(i, 1);
				break;
			}
		}
	}

	/* Public functions */
	public doTrick(): boolean {
		while (!this.isFinished() && !pausing) {
			this.advanceTrick();
		}
		return true;
	}

	public isFinished(): boolean {
		let cardsToPlay = this.__alone ? 3 : 4;
		return this.__playedCards.length >= cardsToPlay;
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
