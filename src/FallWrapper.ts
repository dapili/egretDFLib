namespace df {
	/**
	 * 下落包装器，下落呈正弦运动
	 * @example
	 *	let fw = new FallWraper();
	 *	fw.init(entity, 2, 0.01);
	 *	yourLoop {
	 *		fw.move();
	 *	}
	 */
	export class FallWrapper {
		public constructor() {
		}

		private _entity: any;
		private _vy: number;
		private _angelStep: number;
		/**
		 * 
		 * @param entity 下落对象
		 * @param vy 
		 * @param angelStep 用于正弦变化的角度值，推荐取较小的值如0.01；
		 */
		public init(entity: any, vy: number, angelStep: number) {
			this._entity = entity;
			this._vy = vy;
			this._angelStep = angelStep;
		}

		private _startAngel: number = Math.random() * 360;
		public move() {
			this._entity.y += this._vy;
			this._startAngel += this._angelStep;
			this._entity.x += Math.sin(this._startAngel);
		}

		public get x(): number {
			return this._entity.x;
		}

		public set x(v: number) {
			this._entity.x = v;
		}

		public set y(v: number) {
			this._entity.y = v;
		}

		public get y() {
			return this._entity.y;
		}

		public get width(): number {
			return this._entity.width;
		}

		public get height(): number {
			return this._entity.height;
		}

		public get visible(): boolean {
			return this._entity.visible;
		}

		public set visible(v: boolean) {
			this._entity.visible = v;
		}

		/**
		 * 下落对象
		 */
		public get entity(): any {
			return this._entity;
		}

	}
}