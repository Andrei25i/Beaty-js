const { ApplicationCommandOptionType, EmbedBuilder } = require("discord.js");
const { QueueRepeatMode, useQueue } = require("discord-player");
const config = require("../config");

module.exports = {
    name: "loop",
    description: ("Loop the queue in different modes"),
    voiceChannel: true,
    options: [
        {
            name: "mode",
            description: "The loop mode",
            type: ApplicationCommandOptionType.Integer,
            required: true,
            choices: [
                {
                    name: "Off",
                    value: QueueRepeatMode.OFF,
                },
                {
                    name: "Queue",
                    value: QueueRepeatMode.QUEUE,
                },
                {
                    name: "Track",
                    value: QueueRepeatMode.TRACK,
                },
            ]
        }
    ],

    async execute({interaction}) {
        const queue = useQueue(interaction.guild);

        let defaultEmbed = new EmbedBuilder().setColor(config.embeds.color);
        if (!queue?.isPlaying()) {
            defaultEmbed.setDescription("There is currently no queue")
            return interaction.editReply({embeds: [defaultEmbed]}).then(message => {
                message.react('❌');
            });
        }

        const loopMode = interaction.options.getInteger("mode");
        queue.setRepeatMode(loopMode);

        let loopModeName = "";
        if (loopMode == 0) loopModeName = "Off";
        else if (loopMode == 1) loopModeName = "Track";
        else if (loopMode == 2) loopModeName = "Queue";

        defaultEmbed.setDescription(`Loop mode set to \`${loopModeName}\``)
        interaction.editReply({ embeds: [defaultEmbed] });
    }
}