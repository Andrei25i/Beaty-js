const { EmbedBuilder } = require("discord.js");
const config = require("../config");

module.exports = {
    name: "help",
    description: "Show all the commands of the bot",
    showHelp: false,

    async execute({client, interaction}) {
        const commands = client.commands.filter(x => x.showHelp !== false);
        const commandsName = [];

        for (let [key, value] of commands) commandsName.push(value.name);

        let desc = "";
        for (let command of commandsName) desc += `\`${command}\`, `;
        desc = desc.slice(0, -2);

        let defaultEmbed = new EmbedBuilder()
            .setColor(config.embeds.color)
            .setTitle("/Commands")
            .setDescription(desc);
        
        interaction.editReply({embeds: [defaultEmbed]});
    }
}