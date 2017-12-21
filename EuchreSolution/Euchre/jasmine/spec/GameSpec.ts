describe("GameSpec", function () {
	let game: Game;

	beforeEach(function () {
		const settings = {
			sound: false,
			openHands: false,
			enableDefendAlone: false,
			enableNoTrump: false,
			showTrickHistory: false,
			statMode: true,
			messageLevel: MessageLevel.Step,
			aiPlayers: [new TestAI(), new TestAI(), new TestAI(), new TestAI()],
			hasHooman: false,
			numGamesToPlay: 1,
		};

		game = new Game(settings);
	});

	describe("Initial state", function () {
		it("gameStage", function () {
			expect(game.gameStage()).toBe(GameStage.Playing);
		});
		it("nsScore", function () {
			expect(game.nsScore()).toBe(0);
		});
		it("ewScore", function () {
			expect(game.ewScore()).toBe(0);
		});
	});

	describe("End game", function () {
		beforeEach(function () {
			game.start();
		});

		it("isFinished", function () {
			expect(game.isFinished()).toBe(true);
		});
		it("Someone has won", function () {
			expect(game.nsScore() >= 10 || game.ewScore() >= 10).toBe(true);
		});
		it("Someone has lost", function () {
			expect(game.nsScore() < 10 || game.ewScore() < 10).toBe(true);
		});
	});
});