import logging

from django.http import HttpResponse
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.generic import View, TemplateView

logger = logging.getLogger('django.field_updater')


@method_decorator(ensure_csrf_cookie, name='dispatch')
class ExampleView(TemplateView):
    ''' An endpoint to provide example use of this apps components '''
    template_name = "field_updater/example.html"

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)

        context['updater_options_number'] = dict(
            inputAttributes=dict(type='number'),
        )
        context['updater_options_delete'] = dict(
            allowDelete=True,
        )
        context['updater_options_headers'] = dict(
            headers=dict(yourHeader='yourHeaderValue'),
        )
        context['updater_options_regex'] = dict(
            inputAttributes=dict(
                type='text',
                pattern="[\w]{3}",
                title='3 word characters'),
        )
        return context


class LoggingSubmitView(View):
    ''' An example submit view that does nothing just logs usefully '''
    log_headers = ['Content-Type', 'Accept', 'IfMatch', 'IfUnmodifiedSince']

    def post(self, request, *args, **kwargs):
        ''' update or create your stored value '''
        logger.info(request)
        for key in self.log_headers:
            if key in request.headers:
                logger.info("{}: {}".format(key, request.headers[key]))
        logger.info(request.POST)
        return HttpResponse()

    def delete(self, request, *args, **kwargs):
        ''' delete your stored value '''
        logger.info(request)
        for key in self.log_headers:
            if key in request.headers:
                logger.info("{}: {}".format(key, request.headers[key]))
        return HttpResponse()
