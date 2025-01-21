const { useQueue } = require("discord-player");
const { EmbedBuilder } = require("discord.js");
const config = require("../config");

module.exports = {
    name: "skip",
    description: ("Skips the current song"),
    voiceChannel: true,

    async execute({interaction}) {
        const queue = useQueue(interaction.guild);

        let defaultEmbed = new EmbedBuilder().setColor(config.embeds.color);

        if (!queue?.isPlaying()) {
            defaultEmbed.setDescription("No music is currently playing")
            return interaction.editReply({embeds: [defaultEmbed]}).then(message => {
                message.react('❌');
            });
        }

        queue.node.skip();

        defaultEmbed.setDescription(`Current track **[${queue.currentTrack.title}](${queue.currentTrack.url})** skipped`);
        const message = await interaction.editReply({ embeds: [defaultEmbed] });
        message.react('⏭');
    }
}
