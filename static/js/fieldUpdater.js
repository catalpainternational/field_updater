export default async function initialise(config) {
    // gets a reference to the containing element for the component
    const containerElement = document.getElementById(config.options.prefix + '-' + config.instanceId);

    // gets references to internal elements
    const displayElement = containerElement.querySelector('.' + config.options.prefix + '-display');
    const formElement = containerElement.querySelector('.' + config.options.prefix + '-form');
    const inputElement = containerElement.querySelector('.' + config.options.prefix + '-input');
    const submitElement = containerElement.querySelector('.' + config.options.prefix + '-submit');
    const cancelElement = containerElement.querySelector('.' + config.options.prefix + '-cancel');
    const deleteElement = containerElement.querySelector('.' + config.options.prefix + '-delete');
    const loaderElement = containerElement.querySelector('.' + config.options.prefix + '-loader');
    const errorElement = containerElement.querySelector('.' + config.options.prefix + '-error');

    const { default: StorageHandler } = await import("./ajaxUpdate.js");

    let currentValue = config.attributeValue;
    const storage = new StorageHandler({
        url: config.submitUrl,
        ifUnmodifiedSince: config.ifUnmodifiedSince,
        ifMatch: config.ifMatch,
        bodyEncode: config.options.bodyEncode,
        customHeaders: config.options.headers,
    });

    // set the display back to default
    function updateDisplay() {
        deleteElement.hidden = !config.options.allowDelete || currentValue === null;
        displayElement.innerHTML = currentValue || config.options.emptyDisplay;
    };
    updateDisplay();

    // what happens when the default value display is clicked
    displayElement.onclick = function(e) {
        // show and update the input elements
        inputElement.value = currentValue;
        formElement.hidden = false;
        // hide the display elements
        displayElement.hidden = true;
        errorElement.hidden = true;
        deleteElement.hidden = true;
        // focus the input
        inputElement.focus();
    };

    // what happens whaen the edit cancel button is clicked
    cancelElement.onclick = function(e) {
        formElement.hidden = true;
        displayElement.hidden = false;
    };
    
    // handler to encapsulate an async submission action ( update or delete )
    function submit(action) {
        deleteElement.hidden = true;
        submitElement.hidden = true;
        loaderElement.hidden = false;

        action().then(() => {
            updateDisplay();
            displayElement.hidden = false;
            formElement.hidden = true;
        }).catch((errorCode) => {
            if (config.options.errors.hasOwnProperty(errorCode)) {
                inputElement.setCustomValidity(config.options.errors[errorCode]);
            } else {
                inputElement.setCustomValidity(config.options.errors['unknown']);
            }
            formElement.reportValidity();
        }).finally(() => {
            submitElement.hidden = false;
            loaderElement.hidden = true;
        });
    }

    // what happens when the delete button is clicked
    deleteElement.onclick = async function(e) {
        submit(() => { 
            return storage.remove().then(() => {
                currentValue = null;
            }); 
        });
    };

    // what happens when the update button is clicked
    submitElement.onclick = (e) => {
        e.preventDefault();
        updateOrCreate(inputElement.value);
    }

    // what happens when a key is hit in the input
    inputElement.onkeyup = function(e) {
        inputElement.setCustomValidity('');
        if (e.key === 'Enter') updateOrCreate(inputElement.value);
    }

    async function updateOrCreate(newValue) {
        if (formElement.reportValidity()) {
            let { ajaxUpdate } = await import("./ajaxUpdate.js");

            const data = {};
            data[config.attributeName] = newValue;

            submit(() => {
                return storage.updateOrCreate(data).then(() => {
                    currentValue = newValue;
                });
            });
        }
    }
};
