import getCsrfToken from './getCsrfToken.js';

export function ajaxDelete(options) {
    const fetchInit = {
        method: 'DELETE',
        headers: {
            'X-CSRFToken': getCsrfToken(),
            'Accept': options.headersAccept,
        },
    };
    return ajax(options.submit_url, fetchInit);
}

export function ajaxUpdate(data, options) {
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
    const response = await fetch(url, fetchInit)
        .then(res => res.json()) // pull out JSON from response returned
        .then(json => console.log(json)) // json only returns {"status": "ok"} if all is well
        .catch(err => console.log(err));

    return response;
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
