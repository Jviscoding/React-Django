import uuid

from django.db import models


class User(models.Model):
    id = models.UUIDField(primary_key=True,default=uuid.uuid4,editable=False,)
    user_name = models.CharField(max_length=100)


class Task(models.Model):

    class Status(models.TextChoices):
        TODO = "todo", "To Do"
        IN_PROGRESS = "progress", "In Progress"
        DONE = "done", "Done"

    user = models.ForeignKey( User,on_delete=models.CASCADE,related_name="tasks", null=True, blank=True)
    title = models.CharField(max_length=200)
    description = models.TextField( blank=True)
    status = models.CharField(max_length=20,choices=Status.choices,default=Status.TODO,)
    date_created = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    due_date = models.DateTimeField()


class SubTaskCheckList(models.Model):

    task = models.ForeignKey( Task, on_delete=models.CASCADE,related_name="checklists")
    description = models.TextField()
    is_done = models.BooleanField(default=False)
    date_created = models.DateTimeField(auto_now_add=True)


    class Meta:
        ordering = ["date_created"]