class BiddingTestAI implements BiddingAI {
	private __orderUp: boolean;
	private __discard: Card | null;
	private __trump: Suit | null;
	private __goAlone: boolean;

	public constructor(orderUp: true, trump: null, goAlone: boolean, discard?: Card);
	public constructor(orderUp: false, trump: Suit, goAlone: boolean);
	public constructor(orderUp: false, trump: null, goAlone: false);
	public constructor(orderUp: boolean, trump: Suit | null, goAlone: boolean, discard?: Card) {
		this.__orderUp = orderUp;
		this.__discard = discard === undefined ? null : discard;
		this.__trump = trump;
		this.__goAlone = goAlone;
	}

	//tslint:disable-next-line:no-empty
	public init(): void { }

	public chooseOrderUp(): boolean {
		return this.__orderUp;
	}

	public pickDiscard(): Card | null {
		return this.__discard;
	}

	public pickTrump(): Suit | null {
		return this.__trump;
	}

	public chooseGoAlone(): boolean {
		return this.__goAlone;
	}
}
