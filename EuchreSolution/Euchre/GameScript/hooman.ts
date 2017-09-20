let pausing: boolean = false;
let queuedHoomanBidSuit: Suit | null = null;
let queuedHoomanCard: Card | null = null;

function clickCard(this: HTMLElement): void {
	alert(this.id);
}

//function sleep(ms: number): Promise<{}> {
//	return new Promise(resolve => setTimeout(resolve, ms));
//}

//async function letHoomanBid(): Promise<void> {
//	while (queuedHoomanBidSuit === null) {
//		await sleep(1000);
//	}
//}

function doNothing(): void {
	console.log("meh");
}

function letHoomanBid(): void {
	//while (queuedHoomanBidSuit === null) {
		setTimeout(doNothing, 1000);
	//}
}

function pauseForBid(aiPlayer: EuchreAI | null, stage: BidStage): boolean {
	if (aiPlayer !== null || queuedHoomanBidSuit !== null) {
		return false;
	}

	pausing = true;
	if (stage === BidStage.Round1 || stage === BidStage.Round2) {
		//do animation stuff
	}
	return true;
}

function pauseForTrick(aiPlayer: EuchreAI | null): boolean {
	if (aiPlayer !== null || queuedHoomanCard !== null) {
		return false;
	}

	pausing = true;
	return true;
	//do animation stuff
}