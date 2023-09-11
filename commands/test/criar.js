const {SlashCommandBuilder} = require ('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('criar')
    .setDescription('cria a pessoa no banco de dados'),
    async execute(interaction){
        await interaction
    }
}