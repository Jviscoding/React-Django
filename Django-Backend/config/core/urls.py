from django.urls import path
from .views import UserView

urlpatterns = [
    path('profile',UserView.as_view(), name='task_list' )
    
]
