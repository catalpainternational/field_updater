import uuid
from django import template
from django.urls import reverse

register = template.Library()

@register.inclusion_tag('field_updater/field_updater.html')
def field_updater(
    submit_url,              # url that the ajax will POST the create to
    prefix='field-updater',  # prefix used for id and class scoping,
    etag=False,              # If-Match header will be sent with this value, unless False
    last_modified=False,     # If-Unmodified-Since header will be sent with this value unless False
    **kwargs):
    ''' Renders a value, on click it will render a form, on submit update that value by AJAX '''

    # delete will be allowed only if requested
    allow_delete = kwargs.pop("allow_delete", False)
    #  any extra attributes will be editable, currently we only support one
    try:
        attribute_name, attribute_value = kwargs.popitem()
    except KeyError:
        raise AttributeError('This tag requires a key value attribute describing the field to be updated')

    # random uuid to scope the DOM elements
    instance_id = uuid.uuid4()
    return {
        'options': {
            'instance_id': instance_id,
            'attribute_name': attribute_name,
            'attribute_value': attribute_value,
            'allow_delete': allow_delete,
            'submit_url': submit_url,
            'etag': etag,
            'last_modified': last_modified,
            'prefix': prefix,
        },
    }

@register.filter
def addstr(arg1, arg2):
    """concatenate arg1 & arg2"""
    return str(arg1) + str(arg2)
