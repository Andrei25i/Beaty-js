// All the events that occur in the bot. They will be loaded and runned in the index file
const { EmbedBuilder } = require("discord.js");
const config = require("./config");

let defaultEmbed = new EmbedBuilder().setColor(config.embeds.color);
let titledEmbed = new EmbedBuilder()
    .setColor(config.embeds.color)
    .setTitle(" "); 

// The events are declared here
module.exports = (player) => {
     // Now Playing a song event
     player.events.on("playerStart", async (queue, track) => {
        const channel = queue.metadata.channel;
        defaultEmbed.setDescription(`Now playing: **[${track.title}](${track.url})**`)
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

    // Player error event
    player.events.on("playerError", (queue) => {
        const channel = queue.metadata.channel;

        titledEmbed
            .setTitle("Error")
            .setDescription("An error occurred while playing the track. Please try again.");
        return channel.send({ embeds: [titledEmbed] })
    });
}
