from django.urls import path
from .views import LoggingSubmitView, ExampleView

app_name = 'field_updater'
urlpatterns = [
    # an example endpoint to demonstrate component use
    path('', ExampleView.as_view(), name='examples'),
    # a simple example submit endpoint that returns 200 ok
    path('example_submit', LoggingSubmitView.as_view(), name='example_submit'),
    # an example submit endpoint with a parameter that returns 200 ok
    path('example_submit/<name>/', LoggingSubmitView.as_view(), name='example_submit'),
]
