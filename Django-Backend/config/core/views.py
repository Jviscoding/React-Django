from django.shortcuts import render
from .models import Task, User
from rest_framework.views import APIView, Response
from .Serializers.UserSerializer import UserSerializer
from .Serializers.TaskSerializer import TaskSerializer

# Create your views here.


class UserView(APIView):
    
    def get(self, request):
        
        user_id = request.query_params.get("user_id")
        
        print("user_id:", user_id)
        
        if not user_id:
            return Response({"error": "User not found"}, status=404)
        
        user_id = User.objects.get(pk=user_id)
        user_serializer = UserSerializer(user_id)
        
        # filter get all tasks with this specific user_id
        user_tasks = Task.objects.filter(user_id=user_id)
        tasks_serializer = TaskSerializer(user_tasks, many=True)
        
        
        return Response({"user": user_serializer.data, "tasks": tasks_serializer.data}, status=200)
    
    """
     
        # # filter get all tasks with this specific user_id
        # user_tasks = Task.objects.filter(user_id=user_id)
        # tasks_serializer = TaskSerializer(user_tasks, many=True)
        
    """