namespace df {
    /**
     * 泡泡龙瞄准线
     * 
     * demo见https://github.com/dapili/bubbleRay
     */
    export class BubbleRay {
        public constructor() {
        }

        /**
         * 定义矩形范围
         */
        public rect: { x, y, width, height } = {
            x: 0,
            y: 0,
            width: 0,
            height: 0
        }
        /**
         * 射线起点
         */
        public start: { x, y } = {
            x: 0,
            y: 0
        }
        /**
         * 不能让射线一直反射
         */
        public limit = 0;
        /**
         * 射线交点
         */
        public rayPoints = [];

        /**
         * 计算射线反射相交的点
         * @param angle 起始角度，单位度
         * @param type 0 起点 -1 右侧 1 左侧
         */
        public calPoints(angle, type: number) {
            angle = Math.abs(angle);
            let bHeight;
            let bY;
            if (angle < 90 - 1) {
                if (type == 0) {
                    this.rayPoints.length = 0;
                    bHeight = this.start.x * Math.tan(df.MathUtil.angle2radian(angle));
                    bY = this.rect.height - bHeight;
                    this.rayPoints.push({ x: this.start.x, y: this.start.y })
                    this.rayPoints.push({ x: this.rect.width + this.rect.x, y: bY });

                    this.calPoints(angle, -1);
                }
                else if (type == -1) {
                    bHeight = this.rect.width * Math.tan(df.MathUtil.angle2radian(angle));
                    bY = this.rayPoints[this.rayPoints.length - 1].y - bHeight;
                    if (bY < this.limit) {
                        return;
                    }
                    this.rayPoints.push({ x: this.rect.x, y: bY });

                    this.calPoints(angle, 1);
                }
                else if (type == 1) {
                    bHeight = this.rect.width * Math.tan(df.MathUtil.angle2radian(angle));
                    bY = this.rayPoints[this.rayPoints.length - 1].y - bHeight;
                    if (bY < this.limit) {
                        return;
                    }
                    this.rayPoints.push({ x: this.rect.width + this.rect.x, y: bY });

                    this.calPoints(angle, -1);
                }
            }
            else if (angle > 90 + 1) {
                if (type == 0) {
                    angle = 180 - angle;
                    this.rayPoints.length = 0;
                    bHeight = (this.start.x - this.rect.x) * Math.tan(df.MathUtil.angle2radian(angle));
                    bY = this.rect.height - bHeight;
                    this.rayPoints.push({ x: this.start.x, y: this.start.y })
                    this.rayPoints.push({ x: this.rect.x, y: bY });

                    this.calPoints(angle, 1);
                }
            }
        }
    }
}