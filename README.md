# Field Updater

The intention with this is to provide re-usable component that mimics X-editable
https://vitalets.github.io/x-editable/demo-bs3.html?c=inline

Using Django and raw js to begin with, server side will be provided by individual projects unless we can make really simple safe generic update endpoints

## Usage

### Django template tag
1. Include the `field_update` app in your django settings INSTALLED_APPS
2. Ensure you have csrf_token cookie present by using `ensure_csrf_cookie` decorator on your view
3. Identify the submit view and url you wish to send updates to

if your api returns a Location header the componenet will subequently use that as the submit url

4. load the field updater template tags library in the template you wish to place the updater 

`{% load field_updater_tags %}`

5. Use the field updater template tag passing the url to request to, and the attribute name and initial value as a key value pair

`{% url 'submit_url_name' some_arg=some_value as submit_url %}`
`{% field_updater submit_url=submit_url attribute_name=attribute_value %}`

#### Optionally
6. Pass instance specific options such as if_match or if_unmodified_since to help prevent lost update issues

This will send If-Match or If-Unmodified-Since header with the value passed, enabling the endpoint to return status 412
The component will start sending If-Match if your endpoint returns an ETag header, unless you pass if_match=False
The component will start sending If-Unmodified-Since headers if your endpoint returns a Last-Modified header, unless you pass if_unmodified_since=False

`{% field_updater submit_url=submit_url attribute_name=attribute_value if_match='an_etag' %}`

`{% field_updater submit_url=submit_url attribute_name=attribute_value if_unmodified_since=last_modified %}`

7. Provide an options dictionary, the defaults are as follows and can all be overridden

```
    default_options = {
        'prefix': 'field-updater',      # prefix used for id and class scoping,
        'allowDelete': False,           # delete will be allowed only if true
        'bodyEncode': 'form-data',      # the content encoding for POST bodies ( form-data and urlencoded supported )
        'emptyDisplay': 'empty',        # the text displayed when the value is an empty string or none
        'headers': {},                  # the set of headers sent with ajax requests
        'inputAttributes': {            # input attributes
            'type': 'text',             # only text and number supported
        },
        'errors': {                     # errors to display keyed by HTTP status code
            412: 'The data has been updated on the server, refresh your page to check the current value',
            401: 'Unauthenticated: Please login',
            403: 'Unauthorized: You may not have permission to change this data',
            'unknown': 'Sorry there has been an unforeseen error updating this data',
        },
    }
```

example of overriding to set number input type, an Accept header, and a custom error
```
# in your view
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)

        context['updater_options'] = dict(
            inputAttributes=dict(type='number'),
            headers=dict(yourHeader='yourHeaderValue'),
            errors=dict(401='Please login!'),
        )
        return context
# in your template
        {% field_updater submit_url=submit_url key='headers' options=updater_options %}
```

## Possible future

### More fields
Send more key=value pairs through to the tag for update together
### Rendering a django form
Maybe allowing the js component to take a form definition for rendering
### Validation handling
Adding simple configurable validation
### Riot component
Adding a riot component to use where django is not present
