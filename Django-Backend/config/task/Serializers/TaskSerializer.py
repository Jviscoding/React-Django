from rest_framework import serializers
from task.models import Task
from .SubTaskSerializer import SubTaskSerializer


class TaskSerializer(serializers.ModelSerializer):
    subtasks  = SubTaskSerializer(source="checklists", many=True, read_only=True)

    class Meta:
        model = Task
        fields = "__all__"
