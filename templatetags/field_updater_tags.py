import uuid
from django import template
from django.utils.http import quote_etag

register = template.Library()

@register.inclusion_tag('field_updater/field_updater.html')
def field_updater(
    submit_url,                         # url that the ajax will POST the create to
    if_match=None,                      # If-Match header will be sent with this value, unless False
    if_unmodified_since=None,           # If-Unmodified-Since header will be sent with this value unless False
    options=None,               # Options for this field updater
    **kwargs):
    ''' Renders a value, on click it will render a form, on submit update that value by AJAX '''

    #  any extra attributes will be editable, currently we only support one
    try:
        attribute_name, attribute_value = kwargs.popitem()
    except KeyError:
        raise AttributeError('This tag requires a key value attribute describing the field to be updated')

    # default values for options to be overridden by parameter updater_options
    default_options = {
        'prefix': 'field-updater',      # prefix used for id and class scoping,
        'allowDelete': False,           # delete will be allowed only if requested
        'bodyEncode': 'form-data',      # the content encoding for POST bodies
        'emptyDisplay': 'empty',        # the text displayed when the value is an empty string or none
        'headers': {},                  # the set of headers sent with ajax requests
        'inputAttributes': {            # input attributes
            'type': 'text',
        },
        'errors': {                     # errors to display keyed by HTTP status code
            412: 'The data has been updated on the server, refresh your page to check the current value',
            401: 'Unauthenticated: Please login',
            403: 'Unauthorized: You may not have permission to change this data',
            'unknown': 'Sorry there has been an unforeseen error updating this data',
        },
    }

    # build field updater options
    updater_options = dict(default_options)
    if options:
        for key, value in options.items():
            if key != 'errors':
                updater_options[key] = value
        errors = options.get('errors', {});
        for key, value in errors.items():
            updater_options['errors'][key] = value

    validate_options(updater_options)

    # random uuid to scope the DOM elements
    instance_id = uuid.uuid4()
    return {
        'updater': {
            'instanceId': instance_id,
            'submitUrl': submit_url,
            'attributeName': attribute_name,
            'attributeValue': attribute_value,
            'ifMatch': quote_etag(if_match) if if_match else if_match,
            'ifUnmodifiedSince': if_unmodified_since,
            'options': updater_options,
        },
    }

def validate_options(options):
    if options['bodyEncode'] not in ['urlencoded', 'form-data']:
        raise AttributeError('options bodyEncode must be urlencoded or form-data')
    if options['inputAttributes']['type'] not in ['text', 'number']:
        raise AttributeError('options inputAttributes type must be text or number')

@register.filter
def addstr(arg1, arg2):
    """concatenate arg1 & arg2"""
    return str(arg1) + str(arg2)

@register.filter
def to_str(arg):
    """ just str it for display """
    return str(arg)
