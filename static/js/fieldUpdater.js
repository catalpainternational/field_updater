export default async function initialise(options) {
    // gets a reference to the containing element for the component
    const containerElement = document.getElementById(options.prefix + '-' + options.instance_id);

    // gets references to internal elements
    const displayElement = containerElement.querySelector('.' + options.prefix + '-display');
    const inputsElement = containerElement.querySelector('.' + options.prefix + '-inputs');
    const inputElement = containerElement.querySelector('.' + options.prefix + '-input');
    const submitElement = containerElement.querySelector('.' + options.prefix + '-submit');
    const cancelElement = containerElement.querySelector('.' + options.prefix + '-cancel');
    const deleteElement = containerElement.querySelector('.' + options.prefix + '-delete');
    const loaderElement = containerElement.querySelector('.' + options.prefix + '-loader');
    const errorElement = containerElement.querySelector('.' + options.prefix + '-error');

    const { default: StorageHandler } = await import("./ajaxUpdate.js");

    let current_value = options.attribute_value;
    const storage = new StorageHandler({
        url: options.submit_url,
        ifUnmodifiedSince: options.if_unmodified_since,
        ifMatch: options.if_match,
        bodyEncode: options.bodyEncode,
    });

    // set the display back to default
    function updateDisplay() {
        deleteElement.hidden = !options.allow_delete || current_value === null;
        displayElement.innerHTML = current_value || 'empty';
    };
    updateDisplay();

    // what happens when the default value display is clicked
    displayElement.onclick = function(e) {
        // show and update the input elements
        inputElement.value = current_value;
        inputsElement.hidden = false;
        // hide the display elements
        displayElement.hidden = true;
        errorElement.hidden = true;
        deleteElement.hidden = true;
        // focus the input
        inputElement.focus();
    };

    // what happens whaen the edit cancel button is clicked
    cancelElement.onclick = function(e) {
        inputsElement.hidden = true;
        displayElement.hidden = false;
    };
    
    // handler to encapsulate an async submission action ( update or delete )
    function submit(action) {
        inputsElement.hidden = true;
        loaderElement.hidden = false;

        action().then(() => {
            updateDisplay();
        }).catch((err) => {
            errorElement.innerHTML = err;
            errorElement.hidden = false;
        }).finally(() => {
            inputsElement.hidden = true;
            displayElement.hidden = false;
            loaderElement.hidden = true;
        });
    }

    // what happens when the delete button is clicked
    deleteElement.onclick = async function(e) {
        submit(() => { 
            return storage.remove().then(() => {
                current_value = null;
            }); 
        });
    };

    // what happens when the update button is clicked
    submitElement.onclick = () => updateOrCreate(inputElement.value);

    // what happens when a key is hit in the input
    inputElement.onkeyup = function(e) {
        if (e.key === 'Enter') updateOrCreate(inputElement.value);
    }

    async function updateOrCreate(newValue) {
        let { ajaxUpdate } = await import("./ajaxUpdate.js");

        const data = {};
        data[options.attribute_name] = newValue;

        submit(() => { 
            return storage.updateOrCreate(data).then(() => {
                current_value = newValue;
            }); 
        });
    }
};
