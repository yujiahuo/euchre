/******************************************************
/* Actually it's just lazy
/*******************************************************/

class IdiotAI implements EuchreAI {
	// tslint:disable-next-line:no-empty
	public init(): void { }

	public chooseOrderUp(): boolean {
		return false;
	}

	public pickDiscard(): Card | null {
		return null;
	}

	public pickTrump(): Suit | null {
		return null;
	}

	public chooseGoAlone(): boolean {
		return false;
	}

	public pickCard(): Card | null {
		return null;
	}

	// tslint:disable-next-line:no-empty
	public trickEnd(): void { }
}
