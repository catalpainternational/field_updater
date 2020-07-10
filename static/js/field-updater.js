export default function initialise(options) {
    const container = document.querySelector('#' + options.prefix + '-' + options.instance_id);
    const display = container.querySelector('.' + options.prefix + '-display');
    const input = container.querySelector('.' + options.prefix + '-input');
    const clear = container.querySelector('.' + options.prefix + '-clear');
    const submit = container.querySelector('.' + options.prefix + '-submit');
    const cancel = container.querySelector('.' + options.prefix + '-cancel');


    clear.onclick = function(e) {
        alert('clearing');
    };
    cancel.onclick = function(e) {
        alert('cancelling');
    };
    submit.onclick = function(e) {
        const newValue = input.value;
        alert('submitting ' + newValue);
    };
};
