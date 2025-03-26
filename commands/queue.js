const { useQueue, QueueRepeatMode } = require("discord-player");
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const config = require("../config");
const songCommand = require("./song")

module.exports = {
    name: "queue",
    description: "Show all the songs in the queue",
    voiceChannel: true,

    async execute({interaction}) {
        const queue = useQueue(interaction.guild);
        let queueTracks = [];
        const tracksPerPage = config.embeds.tracksPerPage;

        let defaultEmbed = new EmbedBuilder().setColor(config.embeds.color);
        if (!queue) {
            defaultEmbed.setDescription("There is currently no queue");
            return interaction.editReply({embeds: [defaultEmbed]}).then(message => {
                message.react('❌');
            });
        }

        if (queue.isPlaying() && queue.tracks.size < 1 ) {
            return songCommand.execute({ interaction });
        }

        if (queue.tracks.size == 0 && !queue.isPlaying()) {
            defaultEmbed.setDescription("There is no music queued right now. Add some songs with `/play (song/url)`");
            return interaction.editReply({ embeds: [defaultEmbed]});
        }

        for (const track of queue.tracks.data) {
            queueTracks.push({
                    title: track.title,
                    url: track.url,
                    duration: track.duration,
                    durationSeconds: track.durationMS / 1000
            });
        }

        const totalDurationSeconds = queueTracks.reduce((acc, track) => acc + track.durationSeconds, 0);
        const formatDuration = (seconds) => {
            const hours = Math.floor(seconds / 3600);
            const minutes = Math.floor((seconds % 3600) / 60);
            const secs = Math.floor(seconds % 60);
            return `${hours}:${minutes < 10 ? "0" : ""}${minutes}:${secs < 10 ? "0" : ""}${secs}`;
        }

        const totalDurationFormatted = formatDuration(totalDurationSeconds);

        let pages = [];
        let currentPage = 0;
        for (let i = 0; i < queueTracks.length; i += tracksPerPage) {
            let page = queueTracks.slice(i, i + tracksPerPage);
            pages.push(page);
        }

        const generateEmbed = (page) => {
            let loopModeName = "";
            if (queue.repeatMode === QueueRepeatMode.OFF) loopModeName = "Off";
            else if (queue.repeatMode === QueueRepeatMode.TRACK) loopModeName = "Track";
            else if (queue.repeatMode === QueueRepeatMode.QUEUE) loopModeName = "Queue";

            return new EmbedBuilder()
                .setColor(config.embeds.color)
                .setTitle("Music Queue")
                .setDescription(
                    pages[page].map((track, i) => `\`${page * tracksPerPage + i + 1}\` \`[${track.duration}]\` [${track.title}](${track.url})`).join("\n")
                )
                .addFields(
                    { name: "Now Playing", value: `**[${queue.currentTrack.title}](${queue.currentTrack.url})**`},
                    { name: "Entries", value: `\`${queue.tracks.size}\``, inline: true},
                    { name: "Total Duration", value: `\`${totalDurationFormatted}\``, inline: true},
                    { name: "Loop Mode", value: `\`${loopModeName}\``, inline: true},
                )
                .setFooter({text: "/jump <position> to jump to a different track"});
        };

        const backButton = new ButtonBuilder()
            .setCustomId("back")
            .setLabel("Back")
            .setStyle(ButtonStyle.Primary);
        
        const currButton = new ButtonBuilder()
            .setCustomId("curr")
            .setLabel(`Page ${currentPage+1}/${pages.length}`)
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(true);
        
        const nextButton = new ButtonBuilder()
            .setCustomId("next")
            .setLabel("Next")
            .setStyle(ButtonStyle.Primary);

        const row = new ActionRowBuilder().addComponents(backButton, currButton, nextButton);

        let queueEmbed = generateEmbed(currentPage), message;
        if (pages.length <= 1)
            message = await interaction.editReply({ embeds: [queueEmbed], components: [], fetchReply: true });
        else
            message = await interaction.editReply({ embeds: [queueEmbed], components: [row], fetchReply: true });

        const collector = message.createMessageComponentCollector({ time: config.embeds.queueTimeout });

        collector.on("collect", async (i) => {
            if (i.customId === "back") {
                currentPage--;
                if (currentPage < 0) currentPage = pages.length-1;
            } 
            else if (i.customId === "next") {
                currentPage++;
                if (currentPage >= pages.length) currentPage = 0;
            }

            await i.update({
                embeds: [generateEmbed(currentPage)],
                components: [
                    new ActionRowBuilder().addComponents(
                        backButton,
                        currButton.setLabel(`Page ${currentPage+1}/${pages.length}`),
                        nextButton
                    )
                ]
            });
            collector.resetTimer();
        });

        collector.on("end", () => {
            message.delete();
        })
    }
}