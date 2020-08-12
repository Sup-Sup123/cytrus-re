const Minesweeper = require('discord.js-minesweeper');
const express = require('express');
const request = require('request');
const session = require('express-session');
const bodyParser = require('body-parser');

const logger = require('../modules/Logger');

const app = express();
const port = process.env.PORT || 3000;

const initWeb = (client) => {
  app.set('view engine', 'ejs');
  app.use(express.static('static'));
  app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    expires: 604800000
  }));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  app.use('/', require('../dash/routes/index'));
  app.use('/authorization', require('../dash/routes/discord'));
  app.use('/guild', require('../dash/routes/server'));
  app.use('/money', require('../dash/routes/money'));
  app.use('/servers', require('../dash/routes/servers'));
  app.use('/status', require('../dash/routes/status'));
  app.use('/lyrics', require('../dash/routes/lyrics'));
  app.get('/loaderio-11fa82ac99dd408e39b6d751f6d989a7', (req, res) => res.send('loaderio-11fa82ac99dd408e39b6d751f6d989a7'));
  app.get('/commands', (req, res) => {
    if (!req.session.user || req.session.guild) res.redirect('/');

    if (req.query.command) {
      if (!client.commands.has(req.query.command)) return res.redirect('/commands');

      return res.render('command', {user: req.session.user, guilds: req.session.guilds, djsclient: client, command: req.query.command});
    } else return res.render('commands', {user: req.session.user, guilds: req.session.guilds, djsclient: client});
  });
  app.get('/invite', (req, res) => res.send('<script>window.location.href = "https://discordapp.com/oauth2/authorize?client_id=526593597118873620&permissions=8&scope=bot";</script><noscript><a href="https://discordapp.com/oauth2/authorize?client_id=526593597118873620&permissions=8&scope=bot">https://discordapp.com/oauth2/authorize?client_id=526593597118873620&permissions=8&scope=bot</a></noscript>'));
  app.use('/api', require('../dash/routes/api'));
  app.get('/api/invite', (req, res) => res.send({status: 200, invite: 'https://discordapp.com/oauth2/authorize?client_id=526593597118873620&scope=bot&permissions=8'}));
  app.get('/api/server', (req, res) => res.send({status: 200, server: 'https://discord.gg/VfTE9GH'}));
  app.get('/api/client_id', (req, res) => res.send({status: 200, client_id: '526593597118873620'}));
  app.get('/api/upvote', (req, res) => res.send({status: 200, upvote: 'https://discordbotlist.com/bots/cytrus-re'}));
  app.get('/api/website', (req, res) => res.send({status: 200, website: 'https://www.cytrus.ga'}));
  app.get('/api/minesweeper', (req, res) => {
    let minesweeper = new Minesweeper();
    res.send({status: 200, minesweeper: minesweeper.start()});
  });

  app.use((req, res) => {
    res.status(404).send({status: 404, error: 'Page Not Found'});
  });

  app.listen(port, () => logger.log('Web server started.', 'ready'));
};

module.exports = initWeb;
