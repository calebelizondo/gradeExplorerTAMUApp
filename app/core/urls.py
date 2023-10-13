from django.contrib import admin
from django.urls import path
from core import views  # Import views from your app

urlpatterns = [
    path('', views.home, name='home'), 
]