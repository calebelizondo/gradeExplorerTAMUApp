from django.contrib import admin
from django.urls import path
from core import views  
urlpatterns = [
    #home
    path('', views.home, name='home'), 
    #get all subject codes
    path('get_subject_codes/', views.get_subject_codes, name='get_subject_codes'),
    #get grades for professors given subject and course code
    path('get_grades/<str:subject_code>/<str:course_code>/', views.get_grades, name = "get_grades"),
    #get course evaluation data given subject, course code and professor name
    path('get_evals/<str:subject_code>/<str:course_code>/<str:prof_name>', views.get_evals, name="get_evals")

]