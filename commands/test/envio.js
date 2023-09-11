const {SlashCommandBuilder} = require ('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('enviar')
    .setDescription('enviar dinheiro de X para Y'),
    async execute(interaction){
        await interaction
    }
}