const { useQueue } = require("discord-player");
const { ApplicationCommandOptionType, EmbedBuilder } = require("discord.js");
const config = require("../config");

module.exports = {
    name: "remove",
    description: ("Remove a song or multiple songs from the queue"),
    voiceChannel: true,
    options: [
        {
            name: "position",
            description: "The song you want to remove",
            type: ApplicationCommandOptionType.Number,
            required: false,
        },
        {
            name: "interval",
            description: "The interval you want to remove (start:end)",
            type: ApplicationCommandOptionType.String,
            required: false,
        }
    ],

    async execute({interaction}) {
        const queue = useQueue(interaction.guild);

        // If there is no queue
        let defaultEmbed = new EmbedBuilder().setColor(config.embeds.color);
        if (!queue?.isPlaying()) {
            defaultEmbed.setDescription("There is currently no queue")
            return interaction.editReply({embeds: [defaultEmbed]}).then(message => {
                message.react('❌');
            });
        }

        let index = interaction.options.getNumber("position");
        const interval = interaction.options.getString("interval");
        // If no option was selected
        if (index == null && interval == null) {
            defaultEmbed.setDescription("You have to use one of the options to remove a song")
            return interaction.editReply({embeds: [defaultEmbed]}).then(message => {
                message.react('❌');
            });
        }

        // If position was selected
        if (index !== null) {
            if (index < 1) index = 1;
            else if (index > queue.size) index = queue.size;

            const trackToRemove = queue.tracks.toArray()[index - 1];
            queue.removeTrack(trackToRemove);

            defaultEmbed.setDescription(`Removed **[${trackToRemove.title}](${trackToRemove.url})** from the queue`);
            interaction.editReply({ embeds: [defaultEmbed] });
        }

        // If interval was selected
        if (interval !== null) {
            let [start, end] = interval.split(":").map(Number);
            if (isNaN(start) || isNaN(end)) {
                defaultEmbed.setDescription("Invalid interval. Please try something like `start:end`");
                return interaction.editReply({ embeds: [defaultEmbed] }).then(message => {
                    message.react('❌');
                });
            }

            if (start > end) [start, end] = [end, start];
            if (start < 1) start = 1;
            else if (end > queue.size) end = queue.size;

            const tracksToRemove = queue.tracks.toArray().slice(start - 1, end);
            for (const track of tracksToRemove) {
                queue.removeTrack(track);
            }

            if (tracksToRemove.length <= 5) {
                for (const track of tracksToRemove) {
                    defaultEmbed.setTitle(`Removed ${tracksToRemove.length} ${tracksToRemove.length == 1 ? "track" : "tracks"} from the queue`);
                    defaultEmbed.setDescription(
                        tracksToRemove.map((track, i) => `\`${i + 1}\` \`[${track.duration}]\` [${track.title}](${track.url})`).join("\n")
                    );
                    return interaction.editReply({ embeds: [defaultEmbed] });
                }
            }

            defaultEmbed.setDescription(`Removed \`${tracksToRemove.length}\` tracks from the queue`);
            interaction.editReply({ embeds: [defaultEmbed] });
        }
    }
}