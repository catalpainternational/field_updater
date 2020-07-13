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
    submit.onclick = async function(e) {
        // hide the inputs, show the loader
        inputs.style.display = 'none';
        loader.style.display = 'block';

        let { default:update } = await import("./ajaxUpdate.js");

        const data = {};
        data[options.attribute_name] = input.value;

        update(
            options,
            data
        ).then(() => {
            display.innerHTML = input.value;
        }).catch((err) => {
            error.innerHTML = err;
            error.style.display = 'block';
        }).finally(() => {
            inputs.style.display = 'none';
            display.style.display = 'block';
            loader.style.display = 'none';
        });
    };
};
