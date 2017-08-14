/******************************************************
/* Actually it's just lazy
/*******************************************************/

class IdiotAI implements EuchreAI {

	//tslint:disable-next-line:no-empty
	public init() {
		//just chillin'
	}

	public chooseOrderUp() {
		return false;
	}

	public pickDiscard() {
		return null;
	}

	public pickTrump() {
		return null;
	}

	public chooseGoAlone() {
		return false;
	}

	public pickCard() {
		return null;
	}

	public trickEnd(): void {
		return;
	}
}
