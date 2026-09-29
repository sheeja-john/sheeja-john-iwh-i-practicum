require('dotenv').config();
const express = require('express');
const axios = require('axios');
const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));

const PRIVATE_APP_ACCESS = process.env.PRIVATE_APP_ACCESS;

// Route 1: Homepage - fetch and display contacts
app.get('/', async (req, res) => {
  const url = 'https://api.hubapi.com/crm/v3/objects/contacts';
  const headers = {
    Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
    'Content-Type': 'application/json',
  };
  const params = {
    properties: 'firstname,lastname,favourite_game,level,bio',
  };

  try {
    const resp = await axios.get(url, { headers, params });
    res.render('homepage', {
      title: 'Custom Object Homepage | Integrating With HubSpot I Practicum',
      contacts: resp.data.results,
    });
  } catch (err) {
    console.error(err.response ? err.response.data : err.message);
    res.status(500).send('Error fetching contacts');
  }
});

// Route 2: Show the form
app.get('/update-cobj', (req, res) => {
  res.render('updates', {
    title: 'Update Custom Object Form | Integrating With HubSpot I Practicum',
  });
});

// Route 3: Handle form submission
app.post('/update-cobj', async (req, res) => {
  const url = 'https://api.hubapi.com/crm/v3/objects/contacts';
  const headers = {
    Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
    'Content-Type': 'application/json',
  };
  const data = {
    properties: {
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      favourite_game: req.body.favourite_game,
      level: req.body.level,
      bio: req.body.bio,
      email: `${req.body.firstname}.${req.body.lastname}.${Date.now()}@example.com`,
    },
  };

  try {
    await axios.post(url, data, { headers });
    res.redirect('/');
  } catch (err) {
    console.error(err.response ? err.response.data : err.message);
    res.status(500).send('Error creating contact');
  }
});

app.listen(3000, () => console.log('Listening on http://localhost:3000'));