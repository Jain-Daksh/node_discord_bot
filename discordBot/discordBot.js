const { default: axios } = require('axios');
const { Client, Events, GatewayIntentBits } = require('discord.js');
const { registerCommands } = require('./command');


const apiUrl = process.env.API_URL;
const ClientToken = process.env.client_token
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.once(Events.ClientReady, (readyClient) => {
  console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

client.on('messageCreate', (message) => {
  console.log(message.content, 'message');
});

client.on('messageCreate', (message) => {
  if (message.author.bot) return;
  message.reply({
    content: 'hi from bot',
  });
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return;

  const { commandName } = interaction;



  if (commandName === 'createuser') {
    const username = interaction.options.getString('username');
    const email = interaction.options.getString('email');

    if (!username || !email) {
      return interaction.reply('Invalid format! You must provide username, email');
    }

    try {
      const response = await axios.post(`${apiUrl}/users`, {
        username,
        email,
      });

      if (response.data.success) {
        await interaction.reply(
          `User created successfully! Username: ${response.data.result.username}, Email: ${response.data.result.email}`
        );
      } else {
        await interaction.reply(`Failed to create user: ${response.data.message}`);
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        await interaction.reply(`Failed to create user: ${error.response.data.message}`);
      } else {
        console.error('Error creating user:', error.message);
        await interaction.reply('An error occurred while creating the user. Please try again.');
      }
    }
  }


  if (commandName === 'ppgetuser') {
    const username = interaction.options.getString('username');
    try {
      const response = await axios.get(`${apiUrl}/users/${username}`);


      if (response.data.success) {
        const user = response.data.user;
        const subscriptions = response.data.subscriptions;

        let subscriptionDetails = '';
        if (subscriptions && subscriptions.length > 0) {
          subscriptions.forEach((subscription, index) => {
            subscriptionDetails += `
  **Subscription ${index + 1}:**
   Service Name: ${subscription.serviceName}
   Service Link: ${subscription.serviceLink}
   Monthly Fee: $${subscription.monthlyFee}
   Expiry Date: ${subscription.expiryDate ? new Date(subscription.expiryDate).toLocaleDateString() : 'N/A'}
  
  `;
          });
        } else {
          subscriptionDetails = 'No active subscriptions found for this user.';
        }

        await interaction.reply(`
  **User Data:**
   Username: ${user.username}
   Email: ${user.email}


  **Subscription  Data:**
  ${subscriptionDetails}
  `);
      } else {
        await interaction.reply(`User not found: ${response.data.message}`);
      }
    } catch (error) {
      console.error('Error fetching user:', error.message);
      await interaction.reply('An error occurred while fetching the user data. Please try again.');
    }
  }


  if (commandName === 'ppcreateservice') {
    const serviceName = interaction.options.getString('servicename');
    const serviceLink = interaction.options.getString('servicelink');
    const monthlyFee = interaction.options.getString('monthlyfee');
    const username = interaction.options.getString('username');


    try {
      if (!serviceName || !serviceLink || !monthlyFee || !username) {
        return await interaction.reply('Please provide valid service details.');
      }

      const response = await axios.post(`${apiUrl}/subscriptions`, {
        serviceName,
        serviceLink,
        username,
        monthlyFee: parseFloat(monthlyFee.replace('$', '')),
      });

      if (response.data.success) {
        await interaction.reply(`Service created successfully! \nService Name: ${serviceName}\nService Link: ${serviceLink}\nMonthly Fee: ${monthlyFee}`);
      } else {
        await interaction.reply(`Failed to create service: ${response.data.message}`);
      }
    } catch (error) {
      console.error('Error creating service:', error.message);
      await interaction.reply('An error occurred while creating the service. Please try again.');
    }
  }




});


const startBot = async () => {
  await registerCommands(ClientToken, process.env.token);

  client
    .login(process.env.token)
    .then(() => {
      console.log('Discord bot is running...');
    })
    .catch((err) => {
      console.error('Failed to login to Discord:', err);
    });
};

module.exports = { startBot };
