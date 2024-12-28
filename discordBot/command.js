const { Routes, REST } = require('discord.js');

const registerCommands = async (clientId, token) => {
  const commands = [

    {
      name: 'createuser',
      description: 'Create a new user',
      options: [
        {
          type: 3,
          name: 'username',
          description: 'Enter the username',
          required: true,
        },
        {
          type: 3,
          name: 'email',
          description: 'Enter the email address',
          required: true,
        },
        // {
        //   type: 3,
        //   name: 'password',
        //   description: 'Enter the password address',
        //   required: true,
        // },

      ],
    },
    {
      name: 'ppgetuser',
      description: 'Get user data by userID',
      options: [
        {
          type: 3,
          name: 'username',
          description: 'Enter the user ID (username)',
          required: true,
        },
      ],
    },
    {
      name: 'ppcreateservice',
      description: 'Creates a new service with name, link, and fee',
      options: [
        {
          name: 'servicename',
          type: 3,
          description: 'Name of the service',
          required: true,
        },
        {
          name: 'servicelink',
          type: 3,
          description: 'Link to the service',
          required: true,
        },
        {
          name: 'monthlyfee',
          type: 3,
          description: 'Monthly fee of the service',
          required: true,
        },
        {
          name: 'username',
          type: 3,
          description: 'username ',
          required: true,
        },

      ],
    }

  ];

  const rest = new REST({ version: '10' }).setToken(token);

  try {
    console.log('Registering commands...');
    await rest.put(Routes.applicationCommands(clientId), { body: commands });
    console.log('Commands registered successfully!');
  } catch (error) {
    console.error('Error registering commands:', error);
  }
};

module.exports = { registerCommands };
