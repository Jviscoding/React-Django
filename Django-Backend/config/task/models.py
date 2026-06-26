from django.db import models
from core.models import User

# Create your models here.


class Task(models.Model):

    class Status(models.TextChoices):
        TODO = 'Pending'
        IN_PROGRESS = 'In Progress'
        DONE = 'Completed'

    user = models.ForeignKey(User,on_delete=models.CASCADE,related_name="tasks", null=True, blank=True)
    title = models.CharField(max_length=200)
    description = models.TextField( blank=True)
    status = models.CharField(max_length=20,choices=Status.choices,default=Status.TODO,)
    date_created = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    due_date = models.DateTimeField()
    priority = models.CharField(max_length=200)
    category = models.CharField(max_length=200)


class SubTaskCheckList(models.Model):

    task = models.ForeignKey(Task, on_delete=models.CASCADE,related_name="checklists")
    text = models.TextField()
    is_done = models.BooleanField(default=False)
    date_created = models.DateTimeField(auto_now_add=True)


    class Meta:
        ordering = ["date_created"]