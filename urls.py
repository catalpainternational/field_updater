from django.urls import path
from .views import submit, ExampleView

urlpatterns = [
    # an example endpoint to demonstrate component use
    path('', ExampleView.as_view()),
    # a simple example submit endpoint that returns 200 ok
    path('example_submit', submit, name='example_submit'),
    # an example submit endpoint with a parameter that returns 200 ok
    path('example_submit/<name>/', submit, name='example_submit'),
]
