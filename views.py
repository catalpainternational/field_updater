import logging

from django.http import HttpResponse, JsonResponse
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.decorators.http import condition
from django.views.generic import View, TemplateView
from django.views.generic.detail import SingleObjectMixin

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


class ModelSubmitView(SingleObjectMixin, View):
    ''' A simple field updater based on django SingleObjectMixin
    get: returns json serialized model fields
    post:
      - view has no kwargs: creates with request POST dict
      - view has kwargs: update/create using view kwargs to get, POST dict to update
    delete: deletes the model instance
    '''

    def get(self, request, *args, **kwargs):
        ''' gets the object from storage and returns JSON serialization '''
        self.object = super().get_object()
        data = self.object.__dict__.copy()
        data.pop('_state')
        return JsonResponse(data)

    def post(self, request, *args, **kwargs):
        ''' gets the object from storage and updates it '''
        # todo break out method to allow GET params as unique identifiers
        object_unique = kwargs
        if len(object_unique):
            # if we have identifying data, update/create
            self.object, created = self.model.objects.update_or_create(
                defaults=request.POST,
                **object_unique
            )
        else:
            # otherwise create
            created = True
            self.object = self.model.objects.create(**request.POST.dict())

        response = HttpResponse(status=201 if created else 200)

        # set a location header if created
        if created and self.get_instance_url:
            # TODO get_absolute_url() ?
            response['Location'] = self.get_instance_url(self.object)

        return response

    def delete(self, request, *args, **kwargs):
        ''' get and delete '''
        self.object = super().get_object()
        self.object.delete()
        return HttpResponse(status=200)

