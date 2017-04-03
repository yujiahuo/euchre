interface Settings {
	sound: boolean,
	openHands: boolean,
	enableDefendAlone: boolean,
	enableNoTrump: boolean,
	showTrickHistory: boolean,
	statMode: boolean,
	messageLevel: MessageLevel,
	aiPlayers: (EuchreAI | null)[],
	hasHooman: boolean,
	numGamesToPlay: number,
}

class Controller {
	//multi-game
	private __nsGamesWon: number;
	private __ewGamesWon: number;
	private __nsTotalScore: number;
	private __ewTotalScore: number;
	private __settings: Settings;

	public logText: string;

	//Who's going to call these?
	public getNsGamesWon(): number {
		return this.__nsGamesWon;
	}

	public getEwGamesWon(): number {
		return this.__ewGamesWon;
	}

	public getNsTotalScore(): number {
		return this.__nsTotalScore;
	}

	public getEwTotalScore(): number {
		return this.__ewTotalScore;
	}

	public getMessageLevel(): number {
		return this.__settings.messageLevel;
	}

	public isStatMode(): boolean {
		return this.__settings.statMode;
	}

	public isOpenHands(): boolean {
		return this.__settings.openHands;
	}

	/* constructor */
	constructor() {
		this.grabSettings();
		let game: Game = new Game(this.__settings);
		game.start();
	}

	/*******************************
	 * Private functions
	 ********************************/
	private grabSettings(): void {
		//checkbox settings
		this.__settings.sound = (document.getElementById("chkSound") as HTMLInputElement).checked;
		this.__settings.openHands = true //(document.getElementById("chkOpenHands") as HTMLInputElement).checked;
		this.__settings.enableDefendAlone = (document.getElementById("chkDefendAlone") as HTMLInputElement).checked;
		this.__settings.enableNoTrump = (document.getElementById("chkNoTrump") as HTMLInputElement).checked;
		this.__settings.showTrickHistory = (document.getElementById("chkShowHistory") as HTMLInputElement).checked;

		//ai settings
		this.__settings.aiPlayers = [new DecentAI(), new IdiotAI(), new DecentAI(), new IdiotAI()];
		this.__settings.hasHooman = this.__settings.aiPlayers.indexOf(null) > -1;

		//statMode
		this.__settings.statMode = true //(document.getElementById("chkStatMode") as HTMLInputElement).checked; //4 AIs play against each other
		this.__settings.messageLevel = MessageLevel.Step;
		this.__settings.numGamesToPlay = 1;
	}
}




/*private endGame(): void {
		animShowText("Final score: " + this.__nsScore + " : " + this.__ewScore, MessageLevel.Game);
		if (this.__nsScore > this.__ewScore) this.__nsGamesWon++;
		else this.__ewGamesWon++;
		this.__nsTotalScore += this.__nsScore;
		this.__ewTotalScore += this.__ewScore;

		if (this.__numGamesToPlay > this.__gameCounter) {
			this.__gameCounter++;
			this.__gameStage = GameStage.NewGame;
		}
		else {
			this.__gameStage = GameStage.OutsideGame;
			animShowText("Games won: " + this.__nsGamesWon + " : " + this.__ewGamesWon, MessageLevel.Multigame);
			animShowText("Total score: " + this.__nsTotalScore + " : " + this.__ewTotalScore, MessageLevel.Multigame);
			animShowText("Total time: " + (performance.now() - this.__startTime).toFixed(2) + "ms", MessageLevel.Multigame);
		}
	}*/