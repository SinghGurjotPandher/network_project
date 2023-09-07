
from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("add_post/<str:username>", views.add_post, name="add_post"),
    path("profile/<str:username>", views.profile, name = "profile"),
    path("view_post/<str:need>",views.view_post, name="view_post"), #API Route
    path("follow/<str:following_username>/<str:follower_username>",views.follow, name="follow"),
    path("unfollow/<str:unfollowing_username>/<str:unfollower_username>",views.unfollow, name="unfollow"),
    path("following_page", views.following_page, name="following_page"),
    path("people_following", views.people_following, name="people_following"), #API Route
    path("updateBody/<int:pk>", views.updateBody, name = "updateBody"), #API Route
    path("liked/<int:post_pk>", views.liked, name = "liked"), #API Route
]
