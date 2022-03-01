namespace df {
    export class ImgUtil {
        /**
         * @param callback (arraybuffer)=> {console.log(arraybuffer)}
         */
        public static getArraybufferByUrl(src, callback) {
            var xhr = new XMLHttpRequest();
            xhr.open('GET', src, true);
            xhr.responseType = 'arraybuffer';
            xhr.onload = function (e) {
                if (xhr.status == 200) {
                    var uInt8Array = new Uint8Array(xhr.response);
                    callback.call(this, uInt8Array);
                }
            };
            xhr.send();
        }

    }
}