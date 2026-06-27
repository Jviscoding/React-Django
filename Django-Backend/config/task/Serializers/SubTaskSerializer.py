
from rest_framework import serializers
from task.models import SubTaskCheckList



class SubTaskSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = SubTaskCheckList
        fields = "__all__"