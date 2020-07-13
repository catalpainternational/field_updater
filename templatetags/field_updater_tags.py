import uuid
from django import template
from django.urls import reverse

register = template.Library()

@register.inclusion_tag('field_updater/char_field.html', takes_context=True)
def field_updater(
    context,  # access to page context
    current_value='',  # initial value,
    prefix='field-updater',  # prefix used for id and class coping value,
    **kwargs):
    ''' Renders a value, on click it will render a form, on submit  update that value by AJAX '''

    import pudb;pudb.set_trace()

    attribute_name = kwargs.pop("attribute_name", "value")
    submit_url = kwargs.pop("submit_url", reverse("example_submit"))

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
