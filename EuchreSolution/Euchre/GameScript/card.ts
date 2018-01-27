enum Suit {
	Spades,
	Hearts,
	Diamonds,
	Clubs,
}

let suitsArray = [Suit.Spades, Suit.Hearts, Suit.Diamonds, Suit.Clubs];

enum Rank {
	Nine = 9,
	Ten = 10,
	Jack = 11,
	Queen = 12,
	King = 13,
	Ace = 14,
	Left = 15,
	Right = 16,
}

/* Commenting -- unused, and breaks Karma
function getCardSymbol(card: Card): string {
	let cardId = 0x1F0A0;
	const { suit, rank } = Card.getOriginalSuitAndRank(card);
	cardId += suit * 0x10;
	cardId += rank;
	return String.fromCodePoint(cardId);
}*/

function getCardShorthand(card: Card): string {
	const { suit, rank } = Card.getOriginalSuitAndRank(card);
	return (rank > 10 ? Rank[rank].slice(0, 1) : rank) + String.fromCharCode(0x2660 + suit);
}

interface PlayedCard {
	player: Player;
	card: Card;
}

class Card {
	public suit: Suit;
	public rank: Rank;
	public id: string;

	constructor(suit: Suit, rank: Rank)
	constructor(card: Card)
	constructor(suitOrCard: Suit | Card, rank?: Rank) {
		if (typeof suitOrCard === "number") {
			const suit = suitOrCard as Suit;
			this.suit = suit;
			this.rank = rank as Rank;
		} else {
			const card = suitOrCard;
			this.suit = card.suit;
			this.rank = card.rank;
		}

		const { suit: suitForId, rank: rankForId } = Card.getOriginalSuitAndRank(this);
		this.id = Suit[suitForId] + rankForId;
	}

	public static getOriginalSuitAndRank(card: Card): { suit: Suit, rank: Rank } {
		let suit = card.suit;
		let rank = card.rank;
		if (rank === Rank.Right) {
			rank = Rank.Jack;
		} else if (rank === Rank.Left) {
			rank = Rank.Jack;
			suit = getOppositeSuit(suit);
		}
		return { suit, rank };
	}

	public static safeCard(card: Card): Card;
	public static safeCard(card: null): null;
	public static safeCard(card: Card | null): Card | null {
		if (card) {
			return new Card(card);
		}
		return null;
	}
}
