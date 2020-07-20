export async function ajaxDelete(options) {
    const fetchInit = {
        method: 'DELETE',
    };
    return ajax(options.submit_url, fetchInit);    
}
export async function ajaxUpdate(data, options) {
    const fetchInit = {
        method: 'POST',
        body: BODY_ENCODE_FUNCTIONS[options.bodyEncode](data),
    };
    return ajax(options.submit_url, fetchInit);    
}

async function ajax(url, fetchInit) {
    let {default:getCsrfToken} = await import('./getCsrfToken.js');
    // make our request to udpate the value
    return new Promise((resolve, reject) => {
        
        fetch(
            url,
            Object.assign({
                headers: {
                    'X-CSRFToken': getCsrfToken(),
                }
            }, fetchInit)
        ).then(function(response) {
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
