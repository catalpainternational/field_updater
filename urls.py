from django.urls import path
from .views import FakingSubmitView, CacheSubmitView, ExampleView

urlpatterns = [
    # example endpoint to demonstrate component use
    path('', ExampleView.as_view()),

    # submit endpoint that uses the fieldupdater cache
    path('cache_submit', CacheSubmitView.as_view(), name='cache_submit'),
    path('cache_submit/<name>/', CacheSubmitView.as_view(), name='cache_submit'),

    # submit endpoint that will  do nothing but
    # return any status you put in Catalpa-FieldUpdater-Fake header
    path('fake_submit', FakingSubmitView.as_view(), name='faking_submit'),
]
