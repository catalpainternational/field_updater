export default function initialise(options) {
    // gets a reference to the containing element for the component
    const container = document.querySelector('#' + options.prefix + '-' + options.instance_id);

    const display = container.querySelector('.' + options.prefix + '-display');
    const inputs = container.querySelector('.' + options.prefix + '-inputs');
    const input = container.querySelector('.' + options.prefix + '-input');
    const clear = container.querySelector('.' + options.prefix + '-clear');
    const submit = container.querySelector('.' + options.prefix + '-submit');
    const cancel = container.querySelector('.' + options.prefix + '-cancel');
    const loader = container.querySelector('.' + options.prefix + '-loader');
    const error = container.querySelector('.' + options.prefix + '-error');


    display.onclick = function(e) {
        inputs.style.display = 'block';
        display.style.display = 'none';
        input.value = display.innerHTML;
        error.style.display = 'none';
    };
    clear.onclick = function(e) {
        alert('clearing');
    };
    cancel.onclick = function(e) {
        inputs.style.display = 'none';
        display.style.display = 'block';
    };
    submit.onclick = function(e) {
        // hide the inputs
        inputs.style.display = 'none';
        // show the loader
        loader.style.display = 'block';

        // make our request to udpate the value
        fetch('/example_submit').then(function(response) {
            // function that will run on promise resolve;
            if( response.ok ) {
                display.innerHTML = input.value;
            } else {
                error.innerHTML = response.statusText;
                error.style.display = 'block';
            }
        }).catch(function(err) {
            // function that will run on promise reject;
            error.innerHTML = err;
            error.style.display = 'block';
        }).finally(function() {
            // function that will run  always once the promise has resolved or rejected
            inputs.style.display = 'none';
            display.style.display = 'block';
            loader.style.display = 'none';

        });

    };
};
