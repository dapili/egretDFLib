namespace df {
    /**
     * 四叉树  
     * 
     * 实现完全参照https://github.com/timohausmann/quadtree-js  
     * 
     * 由于原版在动态的情况下会不停的生成Quadtree对象，故封装了对象池优化，这部分对用户不可见，仅见属性root注释
     * 
     */
    export class Quadtree {
        constructor() {
        }

        private _max_objects: number;
        private _max_levels: number;
        private _level: number
        private _bounds: { x: number, y: number, width: number, height: number };
        private _objects = [];
        private _nodes: Array<Quadtree> = [];

        /**
         * 初始化四叉树
         * @param bounds 此四叉树边界
         * @param max_objects (可选)此树能容纳的最大数目，超过时此树进一步分成4子树(默认：10)
         * @param max_levels (可选)最大划分深度(默认：4)
         * @param level (可选)当前深度(默认：0)
         */
        public init(bounds: { x: number, y: number, width: number, height: number },
            max_objects?: number, max_levels?: number, level?: number) {
            this._max_objects = max_objects || 10;
            this._max_levels = max_levels || 4;
            this._level = level || 0;
            this._bounds = bounds;
            this._objects.length = 0;
            this._nodes.length = 0;
        };

        /**
         * 分裂成四子树
         */
        private split() {

            var nextLevel = this._level + 1,
                subWidth = this._bounds.width / 2,
                subHeight = this._bounds.height / 2,
                x = this._bounds.x,
                y = this._bounds.y;

            //右上区，第一象限
            this._nodes[0] = df.Pool.instance.getFrom(Quadtree);
            this._nodes[0].root = false;
            this._nodes[0].init({
                x: x + subWidth,
                y: y,
                width: subWidth,
                height: subHeight
            }, this._max_objects, this._max_levels, nextLevel);

            //左上区，第二象限
            this._nodes[1] = df.Pool.instance.getFrom(Quadtree);
            this._nodes[1].root = false;
            this._nodes[1].init({
                x: x,
                y: y,
                width: subWidth,
                height: subHeight
            }, this._max_objects, this._max_levels, nextLevel);

            //左下区，第三象限
            this._nodes[2] = df.Pool.instance.getFrom(Quadtree);
            this._nodes[2].root = false;
            this._nodes[2].init({
                x: x,
                y: y + subHeight,
                width: subWidth,
                height: subHeight
            }, this._max_objects, this._max_levels, nextLevel)

            //右下区，第四象限
            this._nodes[3] = df.Pool.instance.getFrom(Quadtree);
            this._nodes[3].root = false;
            this._nodes[3].init({
                x: x + subWidth,
                y: y + subHeight,
                width: subWidth,
                height: subHeight
            }, this._max_objects, this._max_levels, nextLevel)
        };

        /**
         * 获得此对象属于那几个象限
         * @param pRect 
         * @returns 
         */
        private getIndex(pRect: { x: number, y: number, width: number, height: number }) {

            var indexes: Array<number> = [],
                verticalMidpoint = this._bounds.x + (this._bounds.width / 2),
                horizontalMidpoint = this._bounds.y + (this._bounds.height / 2);

            var startIsNorth = pRect.y < horizontalMidpoint,
                startIsWest = pRect.x < verticalMidpoint,
                endIsEast = pRect.x + pRect.width > verticalMidpoint,
                endIsSouth = pRect.y + pRect.height > horizontalMidpoint;

            //top-right quad
            if (startIsNorth && endIsEast) {
                indexes.push(0);
            }

            //top-left quad
            if (startIsWest && startIsNorth) {
                indexes.push(1);
            }

            //bottom-left quad
            if (startIsWest && endIsSouth) {
                indexes.push(2);
            }

            //bottom-right quad
            if (endIsEast && endIsSouth) {
                indexes.push(3);
            }

            return indexes;
        };

        /**
         * 插入对象
         * @param pRect 
         * @returns 
         */
        public insert(pRect: { x: number, y: number, width: number, height: number }) {

            var i = 0,
                indexes;

            //if we have subnodes, call insert on matching subnodes
            if (this._nodes.length) {
                indexes = this.getIndex(pRect);

                for (i = 0; i < indexes.length; i++) {
                    this._nodes[indexes[i]].insert(pRect);
                }
                return;
            }

            //otherwise, store object here
            this._objects.push(pRect);

            //max_objects reached
            if (this._objects.length > this._max_objects && this._level < this._max_levels) {

                //split if we don't already have subnodes
                if (!this._nodes.length) {
                    this.split();
                }

                //add all objects to their corresponding subnode
                for (i = 0; i < this._objects.length; i++) {
                    indexes = this.getIndex(this._objects[i]);
                    for (var k = 0; k < indexes.length; k++) {
                        this._nodes[indexes[k]].insert(this._objects[i]);
                    }
                }

                //clean up this node
                this._objects = [];
            }
        };

        /**
         * 取回有哪些相邻的对象
         * @param pRect 
         * @returns 
         */
        public retrieve(pRect: { x: number, y: number, width: number, height: number }) {

            var indexes = this.getIndex(pRect),
                returnObjects = this._objects;

            //if we have subnodes, retrieve their objects
            if (this._nodes.length) {
                for (var i = 0; i < indexes.length; i++) {
                    returnObjects = returnObjects.concat(this._nodes[indexes[i]].retrieve(pRect));
                }
            }

            //remove duplicates
            returnObjects = returnObjects.filter(function (item, index) {
                return returnObjects.indexOf(item) >= index;
            });

            return returnObjects;
        };

        /**
         * @重要**标示是否为最上层的根节点，若是则不会被对象池回收，请勿更改**
         */
        public root = true;

        /**
         * 清空此四叉树
         */
        public clear() {

            this._objects.length = 0;

            for (var i = 0; i < this._nodes.length; i++) {
                if (this._nodes.length) {
                    this._nodes[i].clear();
                }
            }

            this._nodes.length = 0;
            if (!this.root) {
                df.Pool.instance.backTo(this);
            }
        };

    }
}