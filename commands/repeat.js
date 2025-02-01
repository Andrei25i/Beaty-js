const { useQueue } = require("discord-player");
const { EmbedBuilder } = require("discord.js");
const config = require("../config");

module.exports = {
    name: "repeat",
    description: "Replay the current song from the start",
    voiceChannel: true,

    async execute({interaction}) {
        const queue = useQueue(interaction.guild);

        let defaultEmbed = new EmbedBuilder().setColor(config.embeds.color);
        if (!queue?.isPlaying()) {
            defaultEmbed.setDescription("No music is currently playing");
            return interaction.editReply({embeds: [defaultEmbed]}).then(message => {
                message.react('❌');
            });
        }

        queue.node.seek(0);

        defaultEmbed.setDescription("Replaying the current song");
        const message = await interaction.editReply({embeds: [defaultEmbed]});
        message.react('🔁');
    }
}