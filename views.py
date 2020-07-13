from django.http import HttpResponse
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.generic import TemplateView


@method_decorator(ensure_csrf_cookie, name='dispatch')
class ExampleView(TemplateView):
    template_name = "field_updater/example.html"


def submit(request):
    return HttpResponse()

