export default async function ajaxUpdate(options, data) {
    let {default:getCsrfToken} = await import('./getCsrfToken.js');
    // make our request to udpate the value
    return new Promise((resolve, reject) => {

        const body = new FormData();
        Object.keys(data).forEach((key) => {
            body.set(key, data[key]);
        });

        fetch(options.submit_url,
            {
                method: 'POST',
                body: body,
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
