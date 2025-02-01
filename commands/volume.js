const { useQueue } = require("discord-player");
const { EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");
const config = require("../config");

module.exports = {
    name: "volume",
    description: ("Changes the volume of the player"),
    voiceChannel: true,
    options: [
        {
            name: "volume",
            description: ("The new volume"),
            type: ApplicationCommandOptionType.Number,
            required: true,
        }
    ],

    async execute({interaction}) {
        const queue = useQueue(interaction.guild);
        
        let defaultEmbed = new EmbedBuilder().setColor(config.embeds.color);
        if (!queue?.isPlaying()) {
            defaultEmbed.setDescription("No music is currently playing");
            return interaction.editReply({embeds: [defaultEmbed]}).then(message => {
                message.react('❌');
            });
        }

        let vol = interaction.options.getNumber("volume");
        if (vol >= 100) vol = 100;
        else if (vol <= 0) vol = 1;

        queue.node.setVolume(vol);

        defaultEmbed.setDescription(`Changed volume to \`${vol}\``)
        interaction.editReply({embeds: [defaultEmbed]});
    }
}
