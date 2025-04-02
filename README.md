# Beaty

This is a Discord music bot I created as a personal project to practice my JavaScript skills and develop something that my friends and I can use when we talk on Discord.

While building this project, I aimed to create a bot that is easy to use, with simple and intuitive commands. This project allowed me to work with the discord.js and discord-player.js libraries, which made handling the audio player more efficient. I also used the Spotify API, allowing users to load public playlists or albums directly from Spotify.

## Features
🎧 Play music from YouTube

🎵 Load Spotify tracks and albums

➕ Add songs to a queue

▶️ Auto-play functionality

</> Easy-to-use commands for playback control

## /Commands
### Song Player
`/play`, `/pause`, `/resume`, `/skip`, `/back`, `/jump`, `/skipto`, `/repeat`, `/seek`, `/loop`, `/volume`, `/stop`, `/song`, `/lyrics`, `/spotify`

### Queue Management
`/queue`, `/remove`, `/clear`, `/shuffle`

## Technologies Used
- [Node.js](https://nodejs.org/en)

- [discord.js](https://discord.js.org/)

- [Discord Player](https://discord-player.js.org/)

- [Spotify API](https://developer.spotify.com/documentation/web-api)

## Requirements
1. [Node.js](https://nodejs.org/en)
2. [A Discord App](https://discord.com/developers/applications) (the actual bot that will be invited on the server. Make sure to enable `Presence Intent`, `Server Members Intent` and `Message Content Intent` and give it all the required permissions)
3. [A Spotify API Key](https://developer.spotify.com/documentation/web-api)

## Installation
1. Clone the repository

```bash
git clone https://github.com/Andrei25i/Beaty-js.git
```

2. Open a terminal in the root of the project and run
```bash
npm install
```

3. Insert the API Keys in the .env file
```bash
TOKEN="DISCORD BOT TOKEN HERE"
CLIENT_ID="DISCORD BOT APPLICATION ID HERE"

SPOTIFY_TOKEN="SPOTIFY CLIENT SECRET HERE"
SPOTIFY_CLIENT_ID="SPOTIFY CLIENT ID HERE"
```

## Usage
To start the bot, run this:
```bash
node ./index.js
```
The bot should now appear to be online.

## Screenshots
![Screenshot 2025-04-02 195444](https://github.com/user-attachments/assets/a3411c64-93c8-4c27-a0af-a82a0b69c11a)

## Other Notes
For all the commands to work, the bot needs to have all the required permissions enabled (in the [Discord Developer Portal](https://discord.com/developers/applications)):

- Send Messages

- Manage Messages

- Embed Links

- Attach Files

- Use Slash Commands

- Connect

## License
This is a personal project created for learning and practice purposes. 

No explicit license is provided.
