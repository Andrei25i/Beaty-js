function extractUrlType(url) {
    const playlistRegex = /^https:\/\/open\.spotify\.com\/playlist\/[a-zA-Z0-9]+(\?.*)?$/;
    const albumRegex = /^https:\/\/open\.spotify\.com\/album\/[a-zA-Z0-9]+(\?.*)?$/;

    if (playlistRegex.test(url)) {
        return "playlist";
    }
    else if (albumRegex.test(url)) {
        return "album";
    }
    else {
        return null;
    }
}

module.exports = extractUrlType;