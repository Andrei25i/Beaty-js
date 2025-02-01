const { useQueue, QueueRepeatMode } = require("discord-player");
const { EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");
const config = require("../config");

module.exports = {
    name: "skipto",
    description: "Skip to a specified position in the queue, deleting the previous tracks",
    voiceChannel: true,
    options: [
        {
            name: "position",
            description: "the position of the track",
            type: ApplicationCommandOptionType.Number,
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

        const position = interaction.options.getNumber("position");
        if (position < 1 || position > queue.size) {
            defaultEmbed.setDescription("Invalid position. Please try again")
            return interaction.editReply({embeds: [defaultEmbed]}).then(message => {
                message.react('❌');
            });
        }

        if (queue.repeatMode === QueueRepeatMode.TRACK) queue.setRepeatMode(QueueRepeatMode.OFF);

        queue.node.skipTo(position-1);

        defaultEmbed.setDescription(`Skipping to track number \`${position}\``);
        interaction.editReply({ embeds: [defaultEmbed] });
    }
}