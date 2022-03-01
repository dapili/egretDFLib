namespace df {
    /**
     * 字符串工具.静态工具类
     */
    export class StringUtil {

        /**
         * 据字节长度截取字符串（英文一个字节，汉字两个字节）
         * @param length 字节长度
         * @param str 原字符串
         * @returns 截取后的字符串，过长会添加'..'结尾
         */
        public static getStrByByteLen(length, str) {
            var count = 0;
            var index = str.length - 1;
            for (var i = 0; i < str.length; i++) {
                if (str.charCodeAt(i) > 255) {
                    count += 2;
                } else {
                    count++;
                }
                if (count >= length) {
                    index = i;
                    break;
                }
            }
            if (index >= str.length - 1) {
                return str;
            }

            return str.substr(str, index + 1) + '..' || str;
        }

        /**
         * 获取url参数值
         * @param key 
         * @returns 
         */
        public static getUrlValueByKey(key: string = "") {
            if (!key) return "";
            let url = window.location.href;
            let str = url.split("?")[1];
            let val = "";
            if (str) {
                let arr = str.split("&");
                for (let qst of arr) {
                    if (qst.search(key) >= 0) {
                        if (qst.search("=") >= 0) {
                            val = qst.split("=")[1];
                        }
                        else {
                            val = "default";
                        }
                        break;
                    }
                }
            }
            return val;
        }

        /**
         * 获取base64编码
         * @param str 
         * @returns 
         */
        public static getBase64(str: string) {
            // 对字符串进行编码
            var encode = encodeURIComponent(str);
            // 对编码的字符串转化base64
            var base64 = btoa(encode);
            return base64;
        }

        /**
         * 反转字符串
         * @param str 
         * @returns 反转后的字符串
         */
        public static reverse(str: string): string {
            return str.split("").reverse().join("");
        }

        /**
         * 去掉字符串所有的回车换行
         * @param str 
         * @returns 无回车换行的字符串
         */
        public static removeEnter(str: string) {
            return str.replace(/[\n|\r|(\r\n)|(\u0085)|(\u2028)|(\u2029))]/g, "");
        }

        /**只转换中文到unicode */
        public static str2utf8(str: String) {
            return str.replace(/([\u4E00-\u9FA5]|[\uFE30-\uFFA0])/g, function (newStr) {
                return "\\u" + newStr.charCodeAt(0).toString(16);
            });
        }

        /**
         * 十进制颜色转换成十六进制(255-->"0000ff")
         * @param decColor 十进制
         * @returns 
         */
        public static htmlColorStr(decColor: number): string {
            let hexColorStr = decColor.toString(16);
            let hexColorStrLen = hexColorStr.length;
            let hexColorStrPre = "0x";
            for (let i = 0; i < 6 - hexColorStrLen; i++) {
                hexColorStrPre += "0";
            }
            let fullHexColorStr = hexColorStrPre + hexColorStr;
            // console.log(`pre color: ${fullHexColorStr}`);
            let htmlColorStr = fullHexColorStr.replace("0x", "");
            // console.log(`after color: ${htmlColorStr}`);
            return htmlColorStr;
        }
    }
}