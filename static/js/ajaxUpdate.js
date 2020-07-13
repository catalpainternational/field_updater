export default async function ajaxUpdate(options, data) {
    let {default:getCsrfToken} = await import('./getCsrfToken.js');
    // make our request to udpate the value
    return new Promise((resolve, reject) => {

        data = new FormData();
        fetch(options.submit_url,
            {
                method: options.submit_method,
                body: data,
                headers: { 
                    'X-CSRFToken': getCsrfToken()
                },
            }
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
