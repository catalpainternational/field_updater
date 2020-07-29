# Field Updater

The intention with this is to provide re-usable component that mimics X-editable
https://vitalets.github.io/x-editable/demo-bs3.html?c=inline

Using Django and raw js to begin with, server side will be provided by individual projects unless we can make really simple safe generic update endpoints

## Usage

### Django template tag
1. Include the `field_update` app in your django settings INSTALLED_APPS
4. Ensure you have csrf_token cookie present by using `ensure_csrf_cookie` decorator on your view
2. Identify the submit view and url you wish to send updates to
3. load the field updater template tags library in the template you wish to place the updater 

`{% load field_updater_tags %}`

4. Use the field updater template tag passing the url to request to, and the attribute name and initial value as a key value pair

{% url 'submit_url_name' some_arg=some_value as submit_url %}

`{% field_updater submit_url=submit_url attribute_name=attribute_value %}`
`{% field_updater submit_url=submit_url attribute_name=attribute_value allow_delete=True %}`

The initial value will be displayed, on clicking the display an update text input will show, edit the value and click the tick, and a POST request will be submitted to `submit_url with formencoded data of `attribute_name=attribute_value`

If you specify `allow_delete=True` it will allow the user to click to send a DELETE request when the current value is not `null`
If you specify `if_match=some_etag_value` it will send that value as an `If-Match` header
If you specify `if_unmodified_since=some_http_date` it will send that value as `If-Unmodified-Since` header

## Possible future

### More fields
Send more key=value pairs through to the tag for update together
### Rendering a django form
Maybe allowing the js component to take a form definition for rendering
### Validation handling
Adding simple configurable validation
### Riot component
Adding a riot component to use where django is not present
