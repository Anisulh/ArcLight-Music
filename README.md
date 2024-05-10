# ArcLight-Music

![Django](https://img.shields.io/badge/Django-3.2-brightgreen.svg)
![React](https://img.shields.io/badge/React-17.0.1-blue.svg)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-2.2-blue.svg)
![Redis](https://img.shields.io/badge/Redis-6.0-red.svg)
![MySQL](https://img.shields.io/badge/MySQL-blue.svg)
![Spotify API](https://img.shields.io/badge/Spotify_API-Integration-green.svg)
![Build](https://img.shields.io/badge/build-passing-brightgreen.svg)

ArcLight-Music is an innovative web application that allows users to join chatrooms and synchronously listen to Spotify music without needing to create a separate account. This application integrates real-time chat functionalities with live music streaming, enhancing the social music listening experience.

**Live Demo**: [ArcLight-Music](https://arclight-music-production.up.railway.app/)

## Built With

- **Django & Django Channels**: For backend development and handling real-time websockets.
- **React**: Used to build the interactive user interface.
- **MySQL**: Database management.
- **Redis**: Managing real-time data flow and caching.
- **Spotify API**: Integrating Spotify's music functionality.
- **Tailwind CSS/UI**: For styling the application.

## Features

- **Accountless Access**: Users can immediately start using the application without the hassle of account creation.
- **Real-Time Chatrooms**: Users can create and join chatrooms where they can chat and listen to music synchronously.
- **Room Codes**: Access chatrooms with a unique code, enhancing privacy and exclusivity.
- **Music Control**: Room hosts can decide if guests can control the music player.
- **Music Search and Control**: Search for music and control playback (play, pause, skip, previous).
- **Synchronized Playback**: Ensures all users in a room hear the same part of the song simultaneously using websockets.

## Getting Started

### Prerequisites

- Node.js
- Python 3.8+
- Redis server

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/your-username/ArcLight-Music.git
   ```

2. **Navigate to the project directory:**

   ```bash
   cd ArcLight-Music
   ```

3. **Install dependencies:**

   For the backend:
   ```bash
   pip install -r requirements.txt
   ```

   For the frontend:
   ```bash
   cd frontend
   npm install
   ```

4. **Environment setup:**

   Ensure you have the Spotify API keys and Redis configured in your environment variables.

5. **Run the application:**

   Start the backend server:
   ```bash
   python manage.py runserver
   ```

   In another terminal, start the frontend:
   ```bash
   npm start
   ```

## Usage

After starting the server, navigate to `http://localhost:3000` to start using ArcLight-Music. Create a room, share the code with friends, and enjoy listening to music together!

## Contributing

Contributions are what make the open-source community such a fantastic place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Contact

The best way to contact me is via email: anisulhaque9391@gmail.com
