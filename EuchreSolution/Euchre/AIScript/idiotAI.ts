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
		var hand;

		hand = game.myHand();
		return hand[0];
	}

	pickTrump() {
		return null;
	}

	chooseGoAlone() {
		return false;
	}

    pickCard() {
        return getFirstLegalCard(myHand());
	}

    trickEnd(): void {
        return;
    }
}
