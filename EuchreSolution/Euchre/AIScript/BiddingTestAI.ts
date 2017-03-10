class BiddingTestAI implements BiddingAI {
	private __orderUp: boolean;
	private __trump: Suit | null;
	private __goAlone: boolean;

	public constructor(orderUp: true, trump: null, goAlone: boolean);
	public constructor(orderUp: false, trump: Suit, goAlone: boolean);
	public constructor(orderUp: false, trump: null, goAlone: false);
	public constructor(orderUp: boolean, trump: Suit | null, goAlone: boolean) {
		this.__orderUp = orderUp;
		this.__trump = trump;
		this.__goAlone = goAlone;
	}

	public init(): void { }

	public chooseOrderUp(): boolean {
		return this.__orderUp;
	}

	public pickDiscard(): null {
		return null;
	}

	public pickTrump(): Suit | null {
		return this.__trump;
	}

	public chooseGoAlone(): boolean {
		return this.__goAlone;
	}
}