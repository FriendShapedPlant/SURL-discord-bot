const { Events } = require('discord.js');

module.exports = {

    name: Events.InteractionCreate,
    //Receives & Executes Slash Commands
    async execute(interaction) {
        if (!interaction.isChatInputCommand()) return; //gets out of here if not a slash command
        const command = interaction.client.commands.get(interaction.commandName);

        if (!command) {
            console.error(`No command matching ${interaction.commandName} was found.`);
            return;
        }

        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(error);
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
            } else {
                await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
            }
        }

    },

};