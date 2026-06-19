from django.db import models

# Create your models here.


class User(models.Model):
    first_name = models.CharField(max_length=100);
    last_name = models.CharField(max_length=100);
    email = models.EmailField(unique=True);
    
    
class Task(models.Model):
    # same as ON DELETE CASCADE with SQL command
    user_id = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    description = models.TextField()
    date_created = models.DateTimeField(auto_now_add=True)
    date_to_work_on = models.DateTimeField()
    is_completed = models.BooleanField(default=False)
    