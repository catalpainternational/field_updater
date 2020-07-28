import getCsrfToken from './getCsrfToken.js';

export async function ajaxDelete(options) {
    const fetchInit = {
        method: 'DELETE',
        headers: {
            'X-CSRFToken': getCsrfToken(),
            'Accept': options.headersAccept,
        },
    };
    return ajax(options.submit_url, fetchInit);
}
export async function ajaxUpdate(data, options) {
    const fetchInit = {
        method: 'POST',
         headers: {
            'X-CSRFToken': getCsrfToken(),
            'Accept': options.headersAccept,
        },
        body: BODY_ENCODE_FUNCTIONS[options.bodyEncode](data),
    };
    return ajax(options.submit_url, fetchInit);
}

async function ajax(url, fetchInit) {
    // make our request to udpate the value
    return new Promise((resolve, reject) => {
        fetch(url, fetchInit)
            .then(function(response) {
                // function that will run on promise resolve;
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

function urlEncode(data) {
   return new URLSearchParams(data);
}

function formEncode(data) {
    const formData = new FormData();
    Object.keys(data).forEach(key => formData.append(key, data[key]));
    return formData;
}

const BODY_ENCODE_FUNCTIONS = {
    'urlencoded': urlEncode,
    'form-data': formEncode,
}
