from django.urls import path
from django.views.generic import TemplateView
from .views import submit

urlpatterns = [
    path('', TemplateView.as_view(template_name='field_updater/example.html')),
    path('example_submit', submit),
]
