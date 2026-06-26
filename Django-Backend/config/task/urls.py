from django.urls import path
from .views import TaskView

urlpatterns = [
    path('task',TaskView.as_view(), name='task' )
    
]
