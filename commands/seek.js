const { useQueue } = require("discord-player");
const { EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");
const ms = require("ms");
const config = require("../config");

module.exports = {
    name: "seek",
    description: "Go back or forward in a song",
    voiceChannel: true,
    options: [
        {
            name: "time",
            description: "the time to skip to",
            type: ApplicationCommandOptionType.String,
            required: true,
        }
    ],

    async execute({interaction}) {
        const queue = useQueue(interaction.guild);
        let defaultEmbed = new EmbedBuilder().setColor(config.embeds.color);

        if (!queue?.isPlaying()) {
            defaultEmbed.setDescription("No music is currently playing")
            return interaction.editReply({embeds: [defaultEmbed]}).then(message => {
                message.react('❌');
            });
        }

        const timeInMs = ms(interaction.options.getString("time"));
        if (timeInMs > queue.currentTrack.durationMS) {
            defaultEmbed.setDescription("The indicated time is higher than the total time of the current song")
            return interaction.editReply({embeds: [defaultEmbed]}).then(message => {
                message.react('❌');
            });
        }

        queue.node.seek(timeInMs);

        defaultEmbed.setDescription(`Moved to \`${interaction.options.getString("time")}\` in the current song`);
        interaction.editReply({ embeds: [defaultEmbed] });
    }
}