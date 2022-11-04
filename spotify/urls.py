
from django.urls import path
from . import views
from rest_framework.urlpatterns import format_suffix_patterns


urlpatterns = [
    path('auth-url', views.AuthUrl, name='auth_url'),
    path('redirect', views.spotify_callback, name='redirect'),
    path('authenticate', views.IsAuthenticated, name='authenticate'),
    path('currently-playing', views.CurrentlyPlaying),
    path('play', views.PlaySong),
    path('pause', views.PauseSong),
    path('next', views.NextSong),
    path('prev', views.PrevSong),
    path('search', views.Search),
    path('get-token', views.GetSpotifyToken)


]

urlpatterns = format_suffix_patterns(urlpatterns)
