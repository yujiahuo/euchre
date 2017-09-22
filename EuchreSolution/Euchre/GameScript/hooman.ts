let pausing: boolean = false;
let animating: boolean = false;
let queuedHoomanOrderUp: boolean | null = null;
let queuedHoomanBidSuit: Suit | null = null;
let queuedHoomanCard: Card | null = null;

function clickCard(this: HTMLElement): void {
	queuedHoomanCard = DECKDICT[this.id];
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

	pausing = true;
	animShowText("Hooman's turn", MessageLevel.Step);
	if (stage === BidStage.Round1 || stage === BidStage.Round2) {
		setTimeout(animEnableBidding(hand, stage, trumpCandidate), 3000);
	}
	return true;
}

function pauseForTrick(aiPlayer: EuchreAI | null): boolean {
	if (aiPlayer !== null || queuedHoomanCard !== null) {
		return false;
	}

	pausing = true;
	animShowText("Hooman's turn", MessageLevel.Step);
	return true;
	//do animation stuff
}

function unpause() {
	animDisableBidding();
	pausing = false;
	if (controller) { controller.continue(); }
}

function clearHoomanQueue() {
	queuedHoomanOrderUp = null;
	queuedHoomanBidSuit = null;
	queuedHoomanCard = null;
}
