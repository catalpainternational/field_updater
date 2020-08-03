export default class AjaxUpdater {
    /* AjaxUpdater - class to provide ajax update methods
     *
     * updateOrCreate - sends a POST request to options.url with form encoded data
     * remove - sends a DELETE request to options.url
     *
     * returns a promise that will resolve if the action is successful, and reject if not
     *
     * options:
     * url                - the url to communicate with ( will update to Location header value )
     * ifMatch            - the value of the If-Match header to send, use false to disable
     * ifUnmodifiedSince  - the value of the If-Unmodified-Since header to send, use false to disable
     * bodyEncode         - the method of encoding the body (urlencoded or form-data
     */

    constructor(options) {
        this.options = Object.assign({}, options);
    }   

    async remove() {
        const fetchInit = {
            method: 'DELETE',
        };
        return this.ajax(fetchInit);    
    }

    async updateOrCreate(data) {
        const fetchInit = {
            method: 'POST',
            body: BODY_ENCODE_FUNCTIONS[this.options.bodyEncode](data),
        };
        Object.keys(data).forEach((key) => {
            fetchInit.body.set(key, data[key]);
        });
        return this.ajax(fetchInit);
    }

    async ajax(fetchInit) {
        const self = this;
        return new Promise(async (resolve, reject) => {
            let { default:getCsrfToken } = await import('./getCsrfToken.js');
            let headers = {
                'X-CSRFToken': getCsrfToken(),
                ...this.options.customHeaders,
            }
            if(this.options.ifMatch) {
                headers['If-Match'] = this.options.ifMatch;
            }
            if(this.options.ifUnmodifiedSince) {
                headers['If-Unmodified-Since'] = this.options.ifUnmodifiedSince;
            }
            fetch(
                this.options.url,
                Object.assign({headers}, fetchInit)
            ).then(function(response) {
                // update the internal options
                self.updateFetchOptions(response.headers);
                if(response.ok) {
                    resolve(response.status);
                } else {
                    reject(response.status)
                }
            }).catch(function(err) {
                // 598 (Informal convention) Network read timeout error
                // used here to indicate generic failure
                reject(598)
            });
        });
    }

    updateFetchOptions(headers) {
        if (headers.has('ETag') && this.options.ifMatch !== false) {
            this.options.ifMatch = headers.get('ETag');
        }
        if (headers.has('Last-Modified') && this.options.ifUnmodifiedSince !== false) {
            this.options.ifUnmodifiedSince = headers.get('Last-Modified');
        }
        if (headers.has('Location')) {
            this.options.url = headers.get('Location');
        }
    }
}

function urlEncode(data) {
   return new URLSearchParams(data);
}

function formEncode(data) {
    let formData = new FormData();
    Object.keys(data).forEach((key) => {
        formData.set(key, data[key]);
    });
    return formData;
}

const BODY_ENCODE_FUNCTIONS = {
    'urlencoded': urlEncode,
    'form-data': formEncode,
}
