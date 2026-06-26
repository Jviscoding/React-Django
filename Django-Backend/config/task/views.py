from django.shortcuts import render
from rest_framework.views import APIView, Response



class TaskView(APIView):
    
    def get(self, request):
            print("DADADADA")
            

            return Response({"data":"DADAD"}, status=200)
    
    def post(self, request):
        print("DADADA")