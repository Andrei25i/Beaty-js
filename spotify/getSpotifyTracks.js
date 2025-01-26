const axios = require("axios");

async function getSpotifyTracks(url, type, token) {
    const id = url.split("/").pop().split("?")[0];
    const endpoint = type === "playlist" ? `https://api.spotify.com/v1/playlists/${id}/tracks` : `https://api.spotify.com/v1/albums/${id}/tracks`;

    const response = await axios.get(endpoint, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    return response.data.items;
}

module.exports = getSpotifyTracks;