import uuid
from django import template
from django.urls import reverse

register = template.Library()

@register.inclusion_tag('field_updater/field_updater.html')
def field_updater(
    submit_url, # url that the ajax will POST the create to
    prefix='field-updater',  # prefix used for id and class scoping,
    body_encode='form-data',  # the content encoding for POST bodies
    headers_accept='application/json',
    **kwargs):
    ''' Renders a value, on click it will render a form, on submit update that value by AJAX '''

    # delete will be allowed only if requested
    allow_delete = kwargs.pop("allow_delete", False)
    #  any extra attributes will be editable, currently we only support one
    try:
        attribute_name, attribute_value = kwargs.popitem()
    except KeyError:
        raise AttributeError('This tag requires a key value attribute describing the field to be updated')

    if body_encode not in ['urlencoded', 'form-data']:
        raise AttributeError('The body_encode must be urlencoded or form-data')

    # random uuid to scope the DOM elements
    instance_id = uuid.uuid4()
    return {
        'options': {
            'instance_id': instance_id,
            'attribute_name': attribute_name,
            'attribute_value': attribute_value,
            'allow_delete': allow_delete,
            'submit_url': submit_url,
            'bodyEncode': body_encode,
            'prefix': prefix,
            'headersAccept': headers_accept,
        },
    }

@register.filter
def addstr(arg1, arg2):
    """concatenate arg1 & arg2"""
    return str(arg1) + str(arg2)
