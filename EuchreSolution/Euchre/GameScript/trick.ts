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
		const playedCards: PlayedCard[] = [];

		for (const playedCard of this.__playedCards) {
			const card = playedCard.card;
			const player = playedCard.player;

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
		const aiPlayer: EuchreAI | null = this.__aiPlayers[this.__currentPlayer];

		const hand = this.__playerHands[this.__currentPlayer];
		if (aiPlayer) {
			card = aiPlayer.pickCard(copyHand(hand), this.__maker, this.__trump, this.cardsPlayed());
		} else {
			if (pauseForTrick(aiPlayer)) {
				return;
			}
			//queuedHoomanCard is always a string if pauseForTrick returns false
			card = getCardFromHand(hand, queuedHoomanCardId as string);
			clearHoomanQueue();
		}
		this.playCard(card);
		if (this.isFinished()) {
			this.endTrick();
		}
	}

	private endTrick(): void {
		for (const ai of this.__aiPlayers) {
			if (ai) {
				ai.trickEnd(this.cardsPlayed);
			}
		}

		animWinTrick(this.winner() as Player, this.cardsPlayed());
	}

	protected playCard(card: Card | null): Card | null {
		if (this.isFinished()) { return null; }

		const currentPlayer = this.__currentPlayer;
		const hand: Card[] = this.__playerHands[currentPlayer];

		if (!card || !isInHand(hand, card) || !isValidPlay(hand, card, this.__suitLead)) {
			card = getFirstLegalCard(hand, this.__suitLead) as Card;
		}

		if (this.__playedCards.length === 0) {
			this.__suitLead = card.suit;
		}
		this.__playedCards.push({ player: currentPlayer, card });
		this.removeFromHand(currentPlayer, card);

		const message = `${Player[currentPlayer]} played ${getCardShorthand(card)}`;
		animShowText(message, MessageLevel.Step, 1);
		animPlayCard(currentPlayer, card.id);

		const alonePlayer = this.__alone ? this.__maker : undefined;
		this.__currentPlayer = getNextPlayer(currentPlayer, alonePlayer);

		return card;
	}

	private removeFromHand(player: Player, card: Card): void {
		const cardID = card.id;

		for (let i = 0; i < this.__playerHands[player].length; i++) {
			if (this.__playerHands[player][i].id === cardID) {
				this.__playerHands[player].splice(i, 1);
				break;
			}
		}
	}

	/* Public functions */
	public doTrick(): boolean {
		while (!this.isFinished() && !pausedForHuman) {
			this.advanceTrick();
		}
		return true;
	}

	public isFinished(): boolean {
		const cardsToPlay = this.__alone ? 3 : 4;
		return this.__playedCards.length >= cardsToPlay;
	}

	public winningTeam(): Team | null {
		const winner = this.winner();
		if (winner === null) {
			return null;
		}

		return getTeam(winner);
	}

	public winner(): Player | null {
		const bestCardPlayed = getBestCardPlayed(this.__playedCards, this.__trump);
		if (!bestCardPlayed) {
			return null;
		}
		return bestCardPlayed.player;
	}
}
