# Field Updater

The intention with this is to provide re-usable component that mimics X-editable
https://vitalets.github.io/x-editable/demo-bs3.html?c=inline

Using Djangom and raw js to begin with, server side will be provided by individual projects unless we can make really simple safe generic update endpoints

## Usage

### Django template tag
1. Include the `field_update` app in your django settings INSTALLED_APPS
2. Identify the url you wish to POST updates to, the url should uniquely identify the object
4. Ensure you have csrf_token cookie present by using `ensure_csrf_cookie` decorator on your view
3. load the field updater template tags library in the template you wish to place the updater 

`{% load filed_updater_tags %}`

4. Use the field updater template tag passing the initial value to display, the url to POST to, and the attribute name and initial value as a key value pair

`{% field_updater submit_url=SUBMIT_URL attribute_name=ATTRIBUTE_VALUE %}`

The initial value will be displayed, on clicking the display an update text input will show, edit the value and click the tick, and a POST request will be submitted to the SUBMIT_URL with formencoded data of ATTRIBUTE_NAME=NEW_VALUE which can be read through the django request.POST QueryDict 
