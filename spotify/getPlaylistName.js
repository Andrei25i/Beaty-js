const axios = require("axios");

async function getPlaylistName(url, type, token) {
    const id = url.split("/").pop().split("?")[0];
    const endpoint = type === "playlist" ? `https://api.spotify.com/v1/playlists/${id}` : `https://api.spotify.com/v1/albums/${id}`;
    
    const response = await axios.get(endpoint, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    const playlistName = response.data.name;
    let artists;
    if (type === "playlist") artists = response.data.owner.display_name;
    else artists = response.data.artists.map(artist => `${artist.name}`).join(", ");

    return `${playlistName} - ${artists}`;
}

module.exports = getPlaylistName;