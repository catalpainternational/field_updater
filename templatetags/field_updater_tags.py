import uuid
from django import template
from django.urls import reverse

register = template.Library()

@register.inclusion_tag('field_updater/field_updater.html')
def field_updater(
    current_value='',  # initial value,
    prefix='field-updater',  # prefix used for id and class scoping,
    attribute_name='attribute_name',  # prefix used for id and class coping value,
    **kwargs):
    ''' Renders a value, on click it will render a form, on submit update that value by AJAX '''

    # url that the ajax will POST the change to
    submit_url = kwargs.pop("submit_url", reverse("example_submit"))

    # random uuid to scope the DOM elements
    instance_id = uuid.uuid4()
    return {
        'options': {
            'instance_id': instance_id,
            'current_value': current_value,
            'attribute_name': attribute_name,
            'submit_url': submit_url,
            'prefix': prefix,
        },
    }

@register.filter
def addstr(arg1, arg2):
    """concatenate arg1 & arg2"""
    return str(arg1) + str(arg2)
