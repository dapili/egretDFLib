namespace df {
	/**
	 * 其它工具类
	 */
	export class ToolUtil {
		public constructor() {
		}

		/**防连点 */
		public static CLICK(context, callBack, time = 1000, param = "_canClick") {
			if (context[param] == undefined) {
				context[param] = true;
			}

			if (context[param]) {
				context[param] = false;
				setTimeout(() => {
					context[param] = true;
				}, time);
				callBack();
			}
			else {
				console.log("Cant click now! Wait!");
			}
		}
	}

}