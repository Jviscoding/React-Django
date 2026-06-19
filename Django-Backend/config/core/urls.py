from django.urls import path
from .views import UserView

urlpatterns = [
    path('',UserView.as_view(), name='task_list' )
    
]
