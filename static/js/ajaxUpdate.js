export default class AjaxUpdater {
    /* AjaxUpdater - class to provide ajax update methods
     *
     * updateOrCreate - sends a POST request to options.url with form encoded data
     * remove - sends a DELETE request to options.url
     *
     * returns a promise that will resolve if the action is successful, and reject if not
     *
     * options:
     * url           - the url to communicate with ( will update to Location header value )
     * etag          - the value of the If-Match header to send, use false to disable
     * lastModified  - the value of the If-Unmofified-Since header to send, use false to disable

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
            body: new FormData(),
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
            }
            if(this.options.etag) {
                headers['If-Match'] = `"${this.options.etag}"`;
            }
            if(this.options.lastModified) {
                headers['If-Unmodified-Since'] = this.options.lastModified;
            }
            fetch(
                this.options.url,
                Object.assign({headers}, fetchInit)
            ).then(function(response) {
                // update the internal options
                self.updateFetchOptions(response.headers);

                if(response.ok) {
                    resolve(response.status, response);
                } else {
                    reject(response.statusText, response.status, response)
                }
            }).catch(function(err) {
                reject(err.message, err)
            });
        });
    }

    updateFetchOptions(headers) {
        if (headers.has('ETag') && this.options.etag !== false) {
            this.options.etag = headers.get('ETag');
        }
        if (headers.has('Last-Modified') && this.options.lastModified !== false) {
            this.options.lastModified = headers.get('Last-Modified');
        }
        if (headers.has('Location')) {
            this.options.url = headers.get('Location');
        }
    }
}
