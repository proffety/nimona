const {SlashCommandBuilder} = require ('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('carteira')
    .setDescription('mostra o saldo'),
    async execute(interaction){
        await interaction
    }
}