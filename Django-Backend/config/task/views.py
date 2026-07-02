from django.shortcuts import render
from rest_framework.views import APIView, Response, status
from .models import Task, SubTaskCheckList
from core.models import User
from django.db import transaction
from .Serializers.TaskSerializer import TaskSerializer
from .Serializers.SubTaskSerializer import SubTaskSerializer



class TaskView(APIView):

    def get(self, request):

        try:

            user = User.objects.get(pk=request.user["sub"])

            # usin prefetch_related also fetched the related column to the other db table to get other data
            # the value of this is what you set on the models at part (related_name)
            # it was same as calling tasks.checklist.all()
            tasks = Task.objects.filter(user=user).prefetch_related("checklists")

            serialized_task = TaskSerializer(tasks, many=True)

            return Response(
                {
                    "success": True,
                    "message": "Tasks data retrieve successfully!",
                    "data": serialized_task.data,
                }
            )

        except User.DoesNotExist:
            return Response(
                {"message": "User not found"},
                status=status.HTTP_404_NOT_FOUND,
            )

        except KeyError as e:
            return Response(
                {"message": f"Missing required field: {e}"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        except Exception as e:
            return Response(
                {
                    "message": "Failed to retrieve task data.",
                    "error": str(e),
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


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
                
                old_subtasks_id = []

                for subtask in user_task_data["subtasks"]:
                    subtask_data = SubTaskCheckList.objects.create(
                        task=task,
                        text=subtask["text"],
                        is_done=subtask["completed"],
                    )
                    
                    subtask_ids = {}
                    subtask_ids["old_id"] = subtask["id"]
                    subtask_ids["new_id"] = subtask_data.id
                    old_subtasks_id.append(subtask_ids)
                    
            
            subtasks = SubTaskCheckList.objects.filter(task=task).values()
            user_task_data["subtasks"] = list(subtasks)
            old_id = user_task_data['id']
            


            
            user_task_data["id"] = task.id

            return Response(
                {
                    "message": "Task created successfully.",
                    "success": True,
                    "data": user_task_data,
                    "old_id": old_id,
                    "old_subtasks_id": old_subtasks_id
                },
                status=status.HTTP_201_CREATED,
            )

        except User.DoesNotExist:
            return Response(
                {"message": "User not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        except KeyError as e:
            return Response(
                {"message": f"Missing required field: {e}"},
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
            
    def delete(self, request):
        try:
            # check if user do exist
            user = User.objects.get(pk=request.user["sub"]);
            task_id = request.data['task_id']
            
            
            task  = Task.objects.get(user=user, id=task_id);
            
            task.delete()
        
            
            return Response(
                {
                    "success": True, 
                    "message": "Task removed successfully",
                    "data": {"deleted_task_id":task_id}}
            )
            
            
        
        except User.DoesNotExist:
            return Response(
                {"message": "User not found."},
                status=status.HTTP_404_NOT_FOUND,
            )
            
        except Task.DoesNotExist:
             return Response(
                {"message": "Task already deleted."},
                {"data": {"deleted_task_id":task_id}},
                status=status.HTTP_200_OK,
            )
    
    
    def patch(self, request):
        
        try:
            user = User.objects.get(pk=request.user["sub"])
            task_id = request.data['task_id']
            updated_task_data = request.data['updated_task_data']
            
            
            task = Task.objects.get(user=user, id=task_id)

            subtasks = SubTaskCheckList.objects.filter(task=task)
            
            for subtask in subtasks:
                for updated in updated_task_data:
                    
                    

                    if str(subtask.id) == updated['id']:
                        subtask.text = updated['text']
                        subtask.is_done = updated['completed']
                        subtask.save()  
                        
                    
            return Response(
            {
                "success": True,
                "message": "Task updated successfully",
                "data": {"subtasks": SubTaskSerializer(subtasks, many=True).data, "task_id": task_id}
            }
            )
        
        except User.DoesNotExist:
            return Response(
                {"message": "User not found."},
                status=status.HTTP_404_NOT_FOUND,
            )
        
        except Task.DoesNotExist:
             return Response(
                {"message": "Task not found."},
                status=status.HTTP_404_NOT_FOUND,
            )
        
        except Exception as e:
            return Response(
                {
                    "message": "Failed to update task.",
                    "error": str(e),
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        
        
        
