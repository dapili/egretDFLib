/// <reference path="TestComponent.ts" />

namespace df {
	/**
	 * 测试子类
	 */
	export class TestUI extends TestComponent {
		public constructor() {
			super();
			console.log("TestUI create");
		}
	}
}