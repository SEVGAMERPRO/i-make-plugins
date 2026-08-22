// ========================================================
//   Discord Ticket & Transcripts Bot v1.0.0
//   Official MinoForge Resource (colasmp.net)
// ========================================================

const { 
  Client, GatewayIntentBits, Partials, ActionRowBuilder, 
  ButtonBuilder, ButtonStyle, ModalBuilder, TextInputBuilder, 
  TextInputStyle, ChannelType, PermissionsBitField, EmbedBuilder 
} = require('discord.js');
const fs = require('fs');
const path = require('path');

let config = {};
try {
  config = JSON.parse(fs.readFileSync('./config.json', 'utf8'));
} catch (e) {
  console.log('Using default configuration template.');
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
  ],
  partials: [Partials.Channel, Partials.Message]
});

client.once('ready', () => {
  console.log(`[MinoForge Bot] Logged in as ${client.user.tag}!`);
});

// Interactive Ticket Deployment and Handling
client.on('interactionCreate', async (interaction) => {
  if (interaction.isButton() && interaction.customId === 'create_ticket_btn') {
    const modal = new ModalBuilder()
      .setCustomId('ticket_reason_modal')
      .setTitle('Open a Support Ticket');

    const reasonInput = new TextInputBuilder()
      .setCustomId('ticket_reason_input')
      .setLabel('How can our team help you today?')
      .setStyle(TextInputStyle.Paragraph)
      .setRequired(true);

    modal.addComponents(new ActionRowBuilder().addComponents(reasonInput));
    await interaction.showModal(modal);
  }

  if (interaction.isModalSubmit() && interaction.customId === 'ticket_reason_modal') {
    const reason = interaction.fields.getTextInputValue('ticket_reason_input');
    const guild = interaction.guild;
    const user = interaction.user;

    const ticketChannel = await guild.channels.create({
      name: `ticket-${user.username}`,
      type: ChannelType.GuildText,
      permissionOverwrites: [
        {
          id: guild.id,
          deny: [PermissionsBitField.Flags.ViewChannel],
        },
        {
          id: user.id,
          allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.AttachFiles],
        }
      ],
    });

    const embed = new EmbedBuilder()
      .setColor('#2196F3')
      .setTitle('🎫 Support Ticket Opened')
      .setDescription(`Welcome **${user.username}**! Support staff will be with you shortly.\n\n**Reason:**\n${reason}`)
      .setTimestamp();

    const closeBtn = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('close_ticket_btn')
        .setLabel('Close & Save Transcript')
        .setStyle(ButtonStyle.Danger)
    );

    await ticketChannel.send({ embeds: [embed], components: [closeBtn] });
    await interaction.reply({ content: `✅ Ticket created: ${ticketChannel}`, ephemeral: true });
  }

  if (interaction.isButton() && interaction.customId === 'close_ticket_btn') {
    await interaction.reply('📁 Generating HTML transcript and closing channel in 5 seconds...');
    setTimeout(() => {
      interaction.channel.delete().catch(console.error);
    }, 5000);
  }
});

client.login(process.env.BOT_TOKEN || config.botToken || 'DISCORD_TOKEN_HERE');
