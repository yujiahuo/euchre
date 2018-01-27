let pausedForHuman: boolean = false;
let animating: boolean = false;
let discarding: boolean = false;
let queuedHoomanOrderUp: boolean | null = null;
let queuedHoomanBidSuit: Suit | null = null;
let queuedHoomanCardId: string | null = null;
let queuedHoomanDiscardCardId: string | null = null;

function clickCard(this: HTMLElement): void {
	if (discarding) {
		queuedHoomanDiscardCardId = this.id;
	} else {
		queuedHoomanCardId = this.id;
	}
	unpause();
}

function clickOrderUp(): void {
	queuedHoomanOrderUp = true;
	unpause();
}

function clickTrump(suit: Suit): void {
	queuedHoomanBidSuit = suit;
	unpause();
}
function clickPass(): void {
	queuedHoomanOrderUp = false;
	unpause();
}

function pauseForBid(aiPlayer: EuchreAI | null, hand: Card[], stage: BidStage, trumpCandidate: Card): boolean {
	if (aiPlayer !== null || queuedHoomanBidSuit !== null || queuedHoomanOrderUp !== null) {
		return false;
	}

	pausedForHuman = true;
	animShowText("Hooman's turn", MessageLevel.Step);
	if (stage === BidStage.Round1 || stage === BidStage.Round2) {
		setTimeout(animEnableBidding(hand, stage, trumpCandidate), 3000);
	}
	return true;
}

function pauseForDiscard(aiPlayer: EuchreAI | null, trumpCandidate: Card): boolean {
	if (aiPlayer !== null || queuedHoomanDiscardCardId !== null) {
		return false;
	}

	pausedForHuman = true;
	discarding = true;
	const trumpCandidateElement = document.getElementById(trumpCandidate.id);
	if (trumpCandidateElement) {
		trumpCandidateElement.addEventListener("click", clickCard);
	}
	animShowText("Hooman's turn to discard", MessageLevel.Step);
	return true;
}

function pauseForTrick(aiPlayer: EuchreAI | null): boolean {
	if (aiPlayer !== null || queuedHoomanCardId !== null) {
		return false;
	}

	pausedForHuman = true;
	animShowText("Hooman's turn", MessageLevel.Step);
	return true;
	//do animation stuff
}

function unpause() {
	animDisableBidding();
	pausedForHuman = false;
	if (controller) { controller.continue(); }
}

//TODO: call this or block queueing up cards before human bidding is done some other way
function clearHoomanQueue() {
	queuedHoomanOrderUp = null;
	queuedHoomanBidSuit = null;
	queuedHoomanCardId = null;
	queuedHoomanDiscardCardId = null;
}
