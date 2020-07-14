export default function initialise(options) {
    // gets a reference to the containing element for the component
    const containerElement = document.querySelector('#' + options.prefix + '-' + options.instance_id);

    const displayElement = containerElement.querySelector('.' + options.prefix + '-display');
    const inputsElement = containerElement.querySelector('.' + options.prefix + '-inputs');
    const inputElement = containerElement.querySelector('.' + options.prefix + '-input');
    const submitElement = containerElement.querySelector('.' + options.prefix + '-submit');
    const cancelElement = containerElement.querySelector('.' + options.prefix + '-cancel');
    const deleteElement = containerElement.querySelector('.' + options.prefix + '-delete');
    const loaderElement = containerElement.querySelector('.' + options.prefix + '-loader');
    const errorElement = containerElement.querySelector('.' + options.prefix + '-error');


    let current_value = options.attribute_value;

    function updateDisplay() {
        deleteElement.hidden = !options.allow_delete || current_value === null;
        displayElement.innerHTML = current_value || 'empty';
    };
    updateDisplay();

    displayElement.onclick = function(e) {
        inputsElement.hidden = false;
        displayElement.hidden = true;;
        inputElement.value = current_value;
        errorElement.hidden = true;;
        deleteElement.hidden = true;
    };
    cancelElement.onclick = function(e) {
        inputsElement.hidden = true;
        displayElement.hidden = false;
    };
    
    function submit(action) {

        inputsElement.hidden = true;
        loaderElement.hidden = false;

        action().then(() => {
            current_value = inputElement.value;
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

    deleteElement.onclick = async function(e) {
        let { ajaxDelete } = await import("./ajaxUpdate.js");
        submit(() => { return ajaxDelete(options); });
    };
    submitElement.onclick = async function(e) {
        // hide the inputs, show the loader
        let { ajaxUpdate } = await import("./ajaxUpdate.js");

        const data = {};
        data[options.attribute_name] = inputElement.value;
        submit(() => { return ajaxUpdate(data, options); });
    };
};
