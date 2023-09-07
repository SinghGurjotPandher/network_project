from django.contrib import admin
from .models import posts, followers

# Register your models here.
admin.site.register(posts)
admin.site.register(followers)