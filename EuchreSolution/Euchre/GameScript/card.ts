enum Suit {
	Clubs,
	Diamonds,
	Hearts,
	Spades,
}

let suitsArray = [Suit.Clubs, Suit.Diamonds, Suit.Hearts, Suit.Spades];

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
			let suit = suitOrCard as Suit;
			this.suit = suit;
			this.rank = rank as Rank;
		} else {
			let card = suitOrCard;
			this.suit = card.suit;
			this.rank = card.rank;
		}

		let suitForId = this.suit;
		let rankForId = this.rank;
		if (rankForId === Rank.Right) {
			rankForId = Rank.Jack;
		} else if (rankForId === Rank.Left) {
			rankForId = Rank.Jack;
			suitForId = getOppositeSuit(suitForId);
		}
		this.id = Suit[suitForId] + rankForId;
	}

	public static safeCard(card: Card): Card
	public static safeCard(card: null): null
	public static safeCard(card: Card | null): Card | null
	public static safeCard(card: Card | null): Card | null {
		if (card) {
			return new Card(card);
		}
		return null;
	}
}