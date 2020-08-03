import time
import hashlib
import logging

from django.core.cache import caches
from django.http import HttpResponse
from django.utils.decorators import method_decorator
from django.utils.http import http_date, quote_etag
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.decorators.http import condition

from django.views.generic import View, TemplateView

logger = logging.getLogger('catalpa.field_updater')


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
        context['updater_options_errors'] = dict(
            headers={'Catalpa-FieldUpdater-Fake': 401},
            errors={
                401: 'Your custom Error',
            }
        )
        return context


class LoggingSubmitView(View):
    ''' An example submit view that does nothing just logs usefully '''
    log_headers = ['Content-Type', 'Accept', 'If-Match', 'If-Unmodified-Since']

    def dispatch(self, request, *args, **kwargs):
        for key in self.log_headers:
            if key in request.headers:
                logger.info("{}: {}".format(key, request.headers[key]))
        return super().dispatch(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        ''' delete your stored value '''
        logger.info(request.POST)

def etag_from_value(value):
    etag = hashlib.md5(','.join(value).encode()).hexdigest()
    return etag

def cache_view_etag(request, *args, **kwargs):
    cache = caches['field_updater']
    store = cache.get(request.path)
    if store is None:
        return None
    return etag_from_value(store['value'])

@method_decorator(condition(etag_func=cache_view_etag, last_modified_func=None), name='dispatch')
class CacheSubmitView(LoggingSubmitView):
    ''' An example submit view that works against the cconfigured cache '''
    def dispatch(self, request, *args, **kwargs):
        self.cache = caches['field_updater']
        return super().dispatch(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        ''' update or create your stored value '''
        super().post(request, *args, **kwargs)
        key = list(request.POST.keys())[0]
        value = request.POST.getlist(key)
        store = {
            'value': value,
            'modified': time.time()
        }
        self.cache.set(request.path, store)
        response = HttpResponse()
        response["ETag"] = quote_etag(etag_from_value(value))
        response["Last-Modified"] = http_date(store['modified'])
        return response

    @condition(etag_func=cache_view_etag, last_modified_func=None)
    def delete(self, request, *args, **kwargs):
        ''' delete your stored value '''
        store = self.cache.delete(request.path)
        response = HttpResponse()
        return response

    def get(self, request, *args, **kwargs):
        ''' get your stored value '''
        store = self.cache.get(request.path)
        response = HttpResponse(store.value)
        response["ETag"] = quote_etag(store['etag'])
        response["Last-Modified"] = http_date(store['modified'])
        return response


class FakingSubmitView(LoggingSubmitView):
    ''' will return 200 to all requests unless header 'Catalpa-FieldUpdater-Fake' is set with a desired status code '''
    def dispatch(self, request, *args, **kwargs):
        return HttpResponse(status=request.META.get('HTTP_CATALPA_FIELDUPDATER_FAKE', 200))
