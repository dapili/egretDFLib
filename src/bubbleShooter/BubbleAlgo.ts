namespace df {
	/**
	 * 泡泡龙相关算法
	 * 
	 * demo见https://github.com/dapili/bubbleShooter
	 */
	export class BubbleAlgo {
		public constructor() {
		}

		public startX = 50;
		public startY = 50;
		public gapX = 3;
		public gapY = 2;
		public row = 8;
		public col = 10;

		/**
		 * 初始泡泡摆放
		 * @param startX 起点xy
		 * @param startY 
		 * @param gapX 列间距
		 * @param gapY 行间距
		 * @param row 行
		 * @param col 列
		 */
		public initConfig(startX, startY, gapX, gapY, row, col) {
			this.startX = startX;
			this.startY = startY;
			this.gapX = gapX;
			this.gapY = gapY;
			this.row = row;
			this.col = col;
		}

		public bubbles: Array<BubbleInterface> = [];
		private _radius = 25;
		private _diameter = this._radius * 2;
		private _startY: number;
		private _class;
		private _type;

		/**
		 * 初始泡泡
		 * @param r 泡泡半径
		 * @param type 共几种类型泡泡
		 * @param Class 泡泡类，非实例，锚点在圆心
		 * @returns 泡泡对象数组
		 */
		public initBubbles<T extends BubbleInterface>(r: number, type: number, Class: { new(): T; }) {
			this._radius = r;
			this._type = type;
			this._class = Class;
			this._addLineIndex = -1;
			this.bubbles.length = 0;
			let sx: number;
			this._startY = this._radius + this.startY;
			for (let i = 0; i < this.row; i++) {
				for (let j = 0; j < this.col; j++) {
					if (i % 2 == 0) {
						sx = this._radius + this.startX;
					}
					else {
						sx = this._diameter + this.startX;
					}
					let bubble = this.createBubble();
					bubble.row = i;
					bubble.x = sx + j * (this._diameter + this.gapX);
					bubble.y = this._startY + i * (this._diameter + this.gapY);
					this.bubbles.push(bubble);
				}
			}

			return this.bubbles;
		}

		/**
		 * 创建泡泡
		 * @returns 泡泡对象
		 */
		public createBubble() {
			let bubble = new this._class();
			bubble.type = df.MathUtil.randomInt(0, this._type - 1);
			return bubble;
		}

		private _addLineIndex = -1;

		/**
		 * 顶部新加一行
		 * @returns 新加泡泡对象数组
		 */
		public addBubbleLine() {
			for (let i = 0; i < this.bubbles.length; i++) {
				this.bubbles[i].y += (this._diameter + this.gapY);
			}

			let line = [];
			let sx: number;
			for (let j = 0; j < this.col; j++) {
				if (this._addLineIndex % 2 == 0) {
					sx = this._radius + this.startX;
				}
				else {
					sx = this._diameter + this.startX;
				}
				let bubble = this.createBubble();
				bubble.row = this._addLineIndex;
				bubble.x = sx + j * (this._diameter + this.gapX);
				bubble.y = this._startY;
				this.bubbles.push(bubble);
				line.push(bubble);
			}
			this._addLineIndex--;
			return line;
		}

		/**
		 * 连接泡泡并摆放到合适的位置
		 * @param linked 被连接的泡泡，参照物
		 * @param link 连接泡泡，最终会在参照物六方向中的一个位置
		 */
		public linkBubble(linked: BubbleInterface, link: BubbleInterface) {
			let gpx = this.gapX;
			let gpy = this.gapY;
			let r = this._radius;
			let d = this._diameter;
			let roundPoints = [
				{ x: linked.x + d + gpx, y: linked.y, row: linked.row }, // 右
				{ x: linked.x - (d + gpx), y: linked.y, row: linked.row }, // 左
				{ x: linked.row % 2 == 0 ? linked.x - (r + gpx) : linked.x - r, y: linked.y - (d + gpy), row: linked.row - 1 }, // 左上
				{ x: linked.row % 2 == 0 ? linked.x - (r + gpx) : linked.x - r, y: linked.y + d + gpy, row: linked.row + 1 }, // 左下
				{ x: linked.row % 2 == 0 ? linked.x + r : linked.x + r + gpx, y: linked.y - (d + gpy), row: linked.row - 1 }, // 右上
				{ x: linked.row % 2 == 0 ? linked.x + r : linked.x + r + gpx, y: linked.y + d + gpy, row: linked.row + 1 } // 右下
			]

			for (let i = 0; i < roundPoints.length; i++) {
				let p: any = roundPoints[i];
				let dis = df.MathUtil.dis(p, link);
				p.dis = dis;
			}

			df.ArrayUtil.sortAscBy("dis", roundPoints);
			link.x = roundPoints[0].x;
			link.y = roundPoints[0].y;
			link.row = roundPoints[0].row;
			this.bubbles.push(link);
		}

		/**
		 * 掉落的泡泡
		 * @returns 掉落泡泡数组
		 */
		public getFallBubbles() {
			let fallBubbles = [];
			for (let i = 0; i < this.bubbles.length; i++) {
				if (this.bubbles[i].visible) {

					let unites = this.getUniteBubbles(this.bubbles[i], false);
					let root = false;
					for (let j = 0; j < unites.length; j++) {
						if (unites[j].y == this._startY) {
							root = true;
							break
						}
					}

					if (!root) {
						for (let j = 0; j < unites.length; j++) {
							if (fallBubbles.indexOf(unites[j]) == -1) {
								fallBubbles.push(unites[j]);
							}
						}
					}
				}
			}

			return fallBubbles;
		}

		private _unites: Array<BubbleInterface> = [];
		private _scans: Array<BubbleInterface> = [];

		/**
		 * 选择同色或不同色的一块泡泡
		 * @returns 泡泡数组
		 */
		public getUniteBubbles(bubble: BubbleInterface, color: boolean) {
			this._unites.length = 0;
			this._scans.length = 0;
			this.scanUniteBubbles(bubble, color);
			return this._unites;
		}

		private scanUniteBubbles(bubble: BubbleInterface, color: boolean) {
			if (bubble.visible && this._scans.indexOf(bubble) == -1) {
				this._scans.push(bubble);

				if (this._unites.indexOf(bubble) == -1) {
					this._unites.push(bubble);

					let roundBubbles = this.selectRoundBubbles(bubble);
					for (let i = 0; i < roundBubbles.length; i++) {
						if (color) {
							if (roundBubbles[i].type == bubble.type) {
								this.scanUniteBubbles(roundBubbles[i], true);
							}
						}
						else {
							this.scanUniteBubbles(roundBubbles[i], false);
						}
					}
				}
			}
		}

		private selectRoundBubbles(bubble: BubbleInterface) {
			let gpx = this.gapX;
			let gpy = this.gapY;
			let r = this._radius;
			let d = this._diameter;
			let roundPoints = [
				{ x: bubble.x + d + gpx, y: bubble.y }, // 右
				{ x: bubble.x - (d + gpx), y: bubble.y }, // 左
				{ x: bubble.row % 2 == 0 ? bubble.x - (r + gpx) : bubble.x - r, y: bubble.y - (d + gpy) }, // 左上
				{ x: bubble.row % 2 == 0 ? bubble.x - (r + gpx) : bubble.x - r, y: bubble.y + d + gpy }, // 左下
				{ x: bubble.row % 2 == 0 ? bubble.x + r : bubble.x + r + gpx, y: bubble.y - (d + gpy) }, // 右上
				{ x: bubble.row % 2 == 0 ? bubble.x + r : bubble.x + r + gpx, y: bubble.y + d + gpy } // 右下
			]

			let roundBubbles: Array<BubbleInterface> = [];
			for (let i = 0; i < this.bubbles.length; i++) {
				let pop = this.bubbles[i];
				for (let j = 0; j < roundPoints.length; j++) {
					let round = roundPoints[j];
					if (pop.x == round.x && pop.y == round.y) {
						roundBubbles.push(pop);
					}
				}
			}

			return roundBubbles;
		}

	}

	export interface BubbleInterface {
		type: number;
		row: number;
		x: number;
		y: number;
		visible: boolean;
		alpha: number;
	}

}