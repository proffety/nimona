const { Client, Events, Collection, GatewayIntentBits } = require('discord.js');
const { token } = require('./config.json');
const fs = require('node:fs');
const path = require('node:path')


const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] });
client.commands = new Collection ();
client.cooldowns = new Collection();


const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		// Set a new item in the Collection with the key as the command name and the value as the exported module
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}




client.once(Events.ClientReady, c => {
	console.log(`Ready! Logged in as ${c.user.tag}`);
});

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;
  
    const { commandName, options } = interaction;
  
    if (commandName === 'criar') {
      const fileName = `${interaction.user.tag}.txt`;
      const content = '1';
  
      fs.writeFile(fileName, content, (err) => {
        if (err) {
          console.error(err);
          return interaction.reply('Houve um erro ao escrever no arquivo.');
        }
  
        interaction.reply('Arquivo criado e escrito com sucesso!');
      });
    } else if (commandName === 'trabalho') {
      const pato = `./${interaction.user.tag}.txt`;
      const salario_minimo = 1550;
  
      fs.readFile(pato, 'utf8', (err, data) => {
        if (err) {
          console.error(err);
          return interaction.reply('Ocorreu um erro ao ler o arquivo.');
        }
        let valorExistente = parseFloat(data) || 0;
        const novoValor = valorExistente + salario_minimo;
  
        fs.writeFile(pato, novoValor.toString(), (err) => {
          if (err) {
            console.error(err);
            return interaction.reply('Ocorreu um erro ao escrever no arquivo.');
          }
          interaction.reply(`Após um dia de trabalho, você ganhou ${salario_minimo} reais.`);
        });
      });
    } else if (commandName === 'carteira') {
      const pato = `./${interaction.user.tag}.txt`;
      const pato2 = fs.readFileSync(pato, 'utf8');
      return interaction.reply(`Sua carteira tem ${pato2} reais.`);
    } else if (commandName === 'enviar') {
      const remetente = interaction.user.tag;
      const destinatario = interaction.options.getUser('destinatario').tag;
      const quantia = parseFloat(interaction.options.getString('quantia'));
  
      if (isNaN(quantia) || quantia <= 0) {
        interaction.reply('Por favor, insira uma quantia válida maior que zero.');
        return;
      }
  
      const arquivoRemetente = `./${remetente}.txt`;
      const arquivoDestinatario = `./${destinatario}.txt`;
  
      fs.readFile(arquivoRemetente, 'utf8', (err, dataRemetente) => {
        if (err) {
          console.error(err);
          return interaction.reply('Ocorreu um erro ao ler o arquivo do remetente.');
        }
  
        let saldoRemetente = parseFloat(dataRemetente) || 0;
  
        if (saldoRemetente < quantia) {
          interaction.reply('Saldo insuficiente para realizar a transferência.');
          return;
        }
  
        fs.readFile(arquivoDestinatario, 'utf8', (err, dataDestinatario) => {
          if (err) {
            console.error(err);
            return interaction.reply('Ocorreu um erro ao ler o arquivo do destinatário.');
          }
  
          let saldoDestinatario = parseFloat(dataDestinatario) || 0;
          saldoRemetente -= quantia;
          saldoDestinatario += quantia;
  
          fs.writeFile(arquivoRemetente, saldoRemetente.toString(), (err) => {
            if (err) {
              console.error(err);
              return interaction.reply('Ocorreu um erro ao atualizar o saldo do remetente.');
            }
  
            fs.writeFile(arquivoDestinatario, saldoDestinatario.toString(), (err) => {
              if (err) {
                console.error(err);
                return interaction.reply('Ocorreu um erro ao atualizar o saldo do destinatário.');
              }
  
              interaction.reply(`Transferência de ${quantia} realizada com sucesso. Saldo do remetente: ${saldoRemetente} reais. Saldo do destinatário: ${saldoDestinatario} reais.`);
            });
          });
        });
      });
    }
  });
  
  client.login(token);