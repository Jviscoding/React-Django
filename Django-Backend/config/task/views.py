from django.shortcuts import render
from rest_framework.views import APIView, Response, status
from .models import Task, SubTaskCheckList
from core.models import User
from django.db import transaction



class TaskView(APIView):
    
    def get(self, request):
            print("DADADADA")
            

            return Response({"data":"DADAD"}, status=200)

    def post(self, request):

        try:
            user_task_data = request.data["task"]
            
            user = User.objects.get(pk=request.user["sub"])

            with transaction.atomic():

                task = Task.objects.create(
                    user=user,
                    title=user_task_data["title"],
                    description=user_task_data["description"],
                    status=user_task_data["status"],
                    priority=user_task_data["priority"],
                    category=user_task_data["category"],
                    due_date=user_task_data["dueDate"],
                )

                for subtask in user_task_data["subtasks"]:
                    SubTaskCheckList.objects.create(
                        task=task,
                        text=subtask["text"],
                        is_done=subtask["completed"],
                    )
                    
                subtasks = SubTaskCheckList.objects.filter(task=task).values()
                        
                user_task_data['subtasks'] = list(subtasks)

            return Response(
                {
                    "message": "Task created successfully.",
                    'status: success': True,
                    'data': user_task_data
                },
                status=status.HTTP_201_CREATED,
            )

        except User.DoesNotExist:
            return Response(
                {
                    "message": "User not found."
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        except KeyError as e:
            return Response(
                {
                    "message": f"Missing required field: {e}"
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        except Exception as e:
            return Response(
                {
                    "message": "Failed to create task.",
                    "error": str(e),
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )