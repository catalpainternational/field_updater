from django.http import HttpResponse
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.generic import TemplateView


@method_decorator(ensure_csrf_cookie, name='dispatch')
class ExampleView(TemplateView):
    ''' An endpoint to provide exmaple use of this apps components '''
    template_name = "field_updater/example.html"


def submit(request, *args, **kwargs):
    ''' An example submit view that simply returns 200 OK '''
    return HttpResponse()

# TODO add more example edpoint tags to return other statuses for testing error behavior

