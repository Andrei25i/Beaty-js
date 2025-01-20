// All the events that occur in the bot. They will be loaded and runned in the index file
const { EmbedBuilder } = require("discord.js");

let defaultEmbed = new EmbedBuilder().setColor("#5072FF");
let titledEmbed = new EmbedBuilder().setColor("#5072FF").setTitle(" "); 

// The events are declared here
module.exports = (player) => {
     // Now Playing a song event
     player.events.on("playerStart", async (queue, track) => {
        const channel = queue.metadata.channel;
        defaultEmbed.setDescription(`Now playing: **[${track.title}](${track.url})**, requested by <@${track.requestedBy.id}>`)
        const message = await channel.send({ embeds: [defaultEmbed] });
        message.react('▶️');
    })


    // Queue has finished event
    player.events.on("emptyQueue", (queue) => {
        const channel = queue.metadata.channel;
        titledEmbed
            .setTitle("Empty Queue")
            .setDescription("There is no music queued right now. Add some songs with `/play (song/url)`")
        channel.send({ embeds: [titledEmbed] });
    })
}
