
from rest_framework import serializers
from ..models import SubTaskCheckList

class SubtaskChecklist(serializers.ModelSerializer):
    
    class Meta:
        model = SubTaskCheckList
        fields =  "__all__"