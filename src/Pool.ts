namespace df {
    /**
     * 对象池工具. 单例工具类
     */
    export class Pool {

        private constructor() { }
        private static _instance: Pool;
        public static get instance(): Pool {
            if (!this._instance) {
                this._instance = new Pool();
            }
            return this._instance;
        }
        private _pool = {};
        /**
         * 拿取对象
         * @param cls 传入类名
         * @returns 对象
         */
        public getFrom(cls) {
            if (this._pool[cls.prototype["__class__"]]) {
                return this._pool[cls.prototype["__class__"]].pop()
            }
            else {
                return new cls();
            }
        }
        /**
         * 归还对象
         * @param instance 实例对象，非类名
         */
        public backTo(instance) {
            if (!this._pool[instance.__proto__["__class__"]]) {
                this._pool[instance.__proto__["__class__"]] = [];
            }
            this._pool[instance.__proto__["__class__"]].push(instance);
        }
        /**
         * 清空整个对象池
         */
        public clear() {
            this._pool = {};
        }
        /**
         * 测试，对象池打印
         */
        public debug() {
            console.log(this._pool);
        }
    }
}