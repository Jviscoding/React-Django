from django.shortcuts import render
from .models import User
from rest_framework.views import APIView, Response
from .Serializers.UserSerializer import UserSerializer

# Create your views here.


class UserView(APIView):
    
    def get(self, request):
                
        try:
            user_id = request.user["sub"]
            user = User.objects.get(id=user_id);
            
            
            
            return Response({
                "success": True, 
                "message": "User Data Fetched Successfully",
                "data": UserSerializer(user).data}, status=200)

            
        except User.DoesNotExist:
            return Response({"success": False, "message": "User not found"}, status=404)
        

        # user_id = User.objects.get(pk=user_id)
        # user_serializer = UserSerializer(user_id)
        
        # # filter get all tasks with this specific user_id
        # user_tasks = Task.objects.filter(user_id=user_id)
        # tasks_serializer = TaskSerializer(user_tasks, many=True)
        
        
    """
     
        # # filter get all tasks with this specific user_id
        # user_tasks = Task.objects.filter(user_id=user_id)
        # tasks_serializer = TaskSerializer(user_tasks, many=True)
        
    """
    
    def post(self, request):
        
        first_name = request.data.get("first_name")
        last_name = request.data.get("last_name")
        user_id = request.user["sub"]
        
        
        try:
            
            user = User.objects.get(id=user_id)
            return Response({
            "success": True, 
            "message": "User Data already existed",
            "data": UserSerializer( ).data}, status=200)
        
        except User.DoesNotExist:
             
            user = User.objects.create(id=user_id, first_name= first_name, last_name= last_name, )
            user.save()
        

            return Response({
                "success": True, 
                "message": "User Data Saved Successfully",
                "data": UserSerializer(user).data}, status=200)