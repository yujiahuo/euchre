describe("AnimController", () => {
	let queueCallback: jasmine.Spy;

	beforeEach(() => {
		queueCallback = jasmine.createSpy("queueCallback");
		jasmine.clock().install();

		// We have to clear the queue, or other tests can interfere
		(AnimController as any).queuedAnimations = [];
		(AnimController as any).running = false;
	});

	afterEach(() => {
		jasmine.clock().uninstall();
	});

	it("Delays disabled", () => {
		AnimController.setDoDelays(false);
		AnimController.queueAnimation(AnimType.NoDelay, () => queueCallback(1));
		expect(queueCallback.calls.count()).toBe(1);
		expect(queueCallback.calls.argsFor(0)[0]).toBe(1);
		AnimController.queueAnimation(AnimType.DealHands, () => queueCallback(2));
		expect(queueCallback.calls.count()).toBe(2);
		expect(queueCallback.calls.argsFor(1)[0]).toBe(2);
		AnimController.queueAnimation(AnimType.PlayCard, () => queueCallback(3));
		expect(queueCallback.calls.count()).toBe(3);
		expect(queueCallback.calls.argsFor(2)[0]).toBe(3);
		AnimController.queueAnimation(AnimType.Discard, () => queueCallback(4));
		expect(queueCallback.calls.count()).toBe(4);
		expect(queueCallback.calls.argsFor(3)[0]).toBe(4);
		AnimController.queueAnimation(AnimType.WinTrick, () => queueCallback(5));
		expect(queueCallback.calls.count()).toBe(5);
		expect(queueCallback.calls.argsFor(4)[0]).toBe(5);
	});

	it("Delays enabled", () => {
		AnimController.setDoDelays(true);
		AnimController.queueAnimation(AnimType.NoDelay, () => queueCallback(1));
		AnimController.queueAnimation(AnimType.DealHands, () => queueCallback(2));
		AnimController.queueAnimation(AnimType.PlayCard, () => queueCallback(3));
		AnimController.queueAnimation(AnimType.Discard, () => queueCallback(4));
		expect(queueCallback.calls.count()).toBe(0);
		jasmine.clock().tick(0);
		expect(queueCallback.calls.count()).toBe(1);
		expect(queueCallback.calls.argsFor(0)[0]).toBe(1);
		jasmine.clock().tick(200);
		expect(queueCallback.calls.count()).toBe(2);
		expect(queueCallback.calls.argsFor(1)[0]).toBe(2);
		jasmine.clock().tick(500);
		expect(queueCallback.calls.count()).toBe(3);
		expect(queueCallback.calls.argsFor(2)[0]).toBe(3);
		jasmine.clock().tick(500);
		expect(queueCallback.calls.count()).toBe(4);
		expect(queueCallback.calls.argsFor(3)[0]).toBe(4);
		jasmine.clock().tick(10000);
		AnimController.queueAnimation(AnimType.WinTrick, () => queueCallback(5));
		expect(queueCallback.calls.count()).toBe(4);
		jasmine.clock().tick(500);
		expect(queueCallback.calls.count()).toBe(5);
		expect(queueCallback.calls.argsFor(4)[0]).toBe(5);
		jasmine.clock().tick(10000);
		expect(queueCallback.calls.count()).toBe(5);
	});
});