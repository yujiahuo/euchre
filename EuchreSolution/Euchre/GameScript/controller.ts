interface Settings {
	sound: boolean;
	openHands: boolean;
	enableDefendAlone: boolean;
	enableNoTrump: boolean;
	showTrickHistory: boolean;
	statMode: boolean;
	messageLevel: MessageLevel;
	aiPlayers: (EuchreAI | null)[];
	hasHooman: boolean;
	numGamesToPlay: number;
}

class Controller {
	//multi-game
	private __nsGamesWon: number;
	private __ewGamesWon: number;
	private __nsTotalScore: number;
	private __ewTotalScore: number;
	private __settings: Settings;
	private __game: Game;
	private __startTime: number;
	private __gameCount: number;

	public logText = "";

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
		this.__settings = {
			sound: true,
			openHands: false,
			enableDefendAlone: false,
			enableNoTrump: false,
			showTrickHistory: false,
			statMode: false,
			messageLevel: MessageLevel.Step,
			aiPlayers: [null, null, null, null],
			hasHooman: false,
			numGamesToPlay: 1,
		};
		this.__nsTotalScore = 0;
		this.__ewTotalScore = 0;
		this.__nsGamesWon = 0;
		this.__ewGamesWon = 0;

		this.grabSettings();
	}

	/*******************************
	 * Private functions
	 ********************************/
	private grabSettings(): void {
		//checkbox settings
		this.__settings.sound = (document.getElementById("chkSound") as HTMLInputElement).checked;
		this.__settings.openHands = true; //(document.getElementById("chkOpenHands") as HTMLInputElement).checked;
		this.__settings.enableDefendAlone = (document.getElementById("chkDefendAlone") as HTMLInputElement).checked;
		this.__settings.enableNoTrump = (document.getElementById("chkNoTrump") as HTMLInputElement).checked;
		this.__settings.showTrickHistory = (document.getElementById("chkShowHistory") as HTMLInputElement).checked;

		//ai settings
		this.__settings.aiPlayers = [
			null,
			new DecentAI(),
			new DecentAI(),
			new DecentAI(),
		];
		this.__settings.hasHooman = this.__settings.aiPlayers.indexOf(null) > -1;

		//statMode: 4 AIs play against each other
		this.__settings.statMode = false; //(document.getElementById("chkStatMode") as HTMLInputElement).checked;
		this.__settings.messageLevel = MessageLevel.Step;
		this.__settings.numGamesToPlay = 1;
	}

	private handleEndGame(): void {
		if (this.__game.nsScore() > this.__game.ewScore()) {
			this.__nsGamesWon++;
		} else {
			this.__ewGamesWon++;
		}
		this.__nsTotalScore += this.__game.nsScore();
		this.__ewTotalScore += this.__game.ewScore();
	}

	/*******************************
	 * Public functions
	 ********************************/
	public playGames(): void {
		this.__gameCount = 0;

		AnimController.setDoDelays(!this.__settings.statMode);
		this.playGame();
	}

	private playGame(): void {
		this.__game = new Game(this.gameDone, this.__settings);
		this.continue();
	}

	private gameDone = (): void => {
		this.handleEndGame();
		this.__gameCount++;
		if (this.__gameCount < this.__settings.numGamesToPlay) {
			this.playGame();
		} else if (this.__settings.statMode) {
			animShowText("Games won: " + this.__nsGamesWon + " : " + this.__ewGamesWon, MessageLevel.Multigame);
			animShowText("Total score: " + this.__nsTotalScore + " : " + this.__ewTotalScore, MessageLevel.Multigame);
			animShowText("Total time: " + (performance.now() - this.__startTime).toFixed(2) + "ms", MessageLevel.Multigame);
			updateLog(this.logText);
		}
	}

	public continue(): void {
		this.__game.doGame();
	}
}