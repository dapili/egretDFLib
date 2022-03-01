namespace df {
	/**
	 * 一个简单的镜头Y方向控制算法，适用向上跳跃且始终不会超出某一限定位置的需求
	 * @example 
	 *	let cy = new CameraY();
	 *	cy.cameraActY = 500;
	 *	cy.roleRealY = 600;
	 *	cy.originBgY = 0
	 *	yourLogic(cy.roleRealY, cy.roleY, cy.nowBgY)
	 */
	export class CameraY {
		public constructor() {
		}

		/**
		 * 镜头活动位置,限制位置
		 */
		public cameraActY: number;

		/**
		 * 角色实际位置，世界位置
		 */
		public roleRealY: number;

		/**
		 * 角色屏幕位置
		 */
		public get roleY(): number {
			let disY = this.roleRealY - this.cameraActY;
			if (disY >= 0) {
				disY = 0;
			}

			return this.roleRealY - disY;
		}

		/**
		 * 原始bg位置
		 */
		public originBgY: number;
		public get nowBgY(): number {
			let disY = this.roleRealY - this.cameraActY;
			if (disY < 0) {
				return this.originBgY - disY;
			}
			return this.originBgY;
		}

	}
}