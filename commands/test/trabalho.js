const {SlashCommandBuilder} = require('discord.js');

module.exports = {
    cooldown: 67000,
    data: new SlashCommandBuilder()
        .setName ('trabalho')
        .setDescription('trabalhar que ninguem é de ferro'),
    async execute(interaction){
        return interaction
    }
}
