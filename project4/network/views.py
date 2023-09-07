from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse
from django import forms
from .models import posts, followers
from django.http import JsonResponse
import json
from django.core.serializers import serialize
from django.core.paginator import Paginator
from django.views.decorators.csrf import csrf_exempt

from .models import User

class PostForm(forms.Form):
    Text = forms.CharField(label = 'New Post', widget = forms.TextInput(attrs={'autofocus': True, 'style': 'width: 300px','class': 'form-control'}))

def index(request):
    return render(request, "network/index.html",{
        "form": PostForm(),
        "data": posts.objects.all()
    })

def add_post(request, username):
    if request.method == "POST":
        form = PostForm(request.POST)
        if form.is_valid():
            post_body = form.cleaned_data["Text"]
            saving = posts(username=username,body=post_body,likes=0)
            saving.save()
    return HttpResponseRedirect("/")

def profile(request,username):
    followers_user = followers.objects.filter(following = username)
    following_user = followers.objects.filter(username = username)
    return render(request, "network/profile.html",{
        "my_followers_len": len(followers_user),
        "profile_username": username,
        "following_len": len(following_user)
    })

#API Route
def view_post(request, need):
    if need == "all":
        Posts = posts.objects.all()#.order_by('-timestamp')
    else:
        Posts = posts.objects.filter(username = need)
    return JsonResponse(json.loads(serialize("json",Posts)), safe = False)

#API Route
def people_following(request):
    user = request.user
    Posts = followers.objects.filter(username = user)
    return JsonResponse(json.loads(serialize("json",Posts)), safe = False)

@csrf_exempt
#API Route
def updateBody(request,pk):
    newBody = json.loads(request.body)
    post = posts.objects.get(pk = pk)
    post.body = newBody["body"]
    post.save()
    return HttpResponse(status=204)

@csrf_exempt
#API Route
def liked(request,post_pk):
    if request.method == "PUT":
        like_num_update =json.loads(request.body)
        post = posts.objects.get(pk = post_pk)
        post.likes = like_num_update["likes"]
        post.save()
        return HttpResponse(status=204)
    else:
        return JsonResponse({"error"},status=400)

def follow(request,following_username, follower_username):
    add = followers(username = follower_username, following = following_username)
    add.save()
    return HttpResponseRedirect(f"/profile/{following_username}")

def unfollow(request,unfollowing_username, unfollower_username):
    remove = followers.objects.filter(username = unfollower_username, following = unfollowing_username)
    remove.delete()
    return HttpResponseRedirect(f"/profile/{unfollowing_username}")

def following_page(request):
    return render(request, "network/following_page.html")

def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "network/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "network/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "network/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "network/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "network/register.html")
