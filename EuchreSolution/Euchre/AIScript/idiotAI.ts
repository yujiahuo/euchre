/******************************************************
/* Never bids
/* Plays its first legal move
/*******************************************************/

class IdiotAI implements EuchreAI {

	init() {
		//just chillin'
	}

	chooseOrderUp() {
		return false;
	}

	pickDiscard() {
		return null;
	}

	pickTrump() {
		return null;
	}

	chooseGoAlone() {
		return false;
	}

	pickCard() {
		return null;
	}

	trickEnd(): void {
		return;
	}
}
