# ArcLight-Music
An application designed to allow users to join chatrooms, and listen to spotify music synchronously without having to create another another account.

**Live Demo:** https://arclight-music-production.up.railway.app/

## Built With:
- Django
- Django Channels
- React
- SQLite3
- Redis
- Spotify API
- Tailwind CSS/UI

## Features
- Users are able to quickly use the application without having to create an account
- Realtime chatrooms that users are able to create
- Join Chatrooms with a unique code
- Hosts of chatrooms can manage whether guests can have control over the music player
- Users can search for specific music and play it
- Music player in rooms can play previous songs, play next songs, and play or pause current song
- Utilizes websockets and django channels to allow for all users in a room to have their music synched 
