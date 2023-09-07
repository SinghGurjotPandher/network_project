from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    pass

class posts(models.Model):
    username = models.CharField(max_length=64)
    body = models.CharField(max_length=255)
    timestamp = models.DateTimeField(auto_now_add=True)
    likes = models.IntegerField(null=True)

class followers(models.Model):
    username = models.CharField(max_length=64)
    following = models.CharField(max_length=64)