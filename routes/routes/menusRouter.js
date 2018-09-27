const express = require('express');

const {
  findClientMenuItems,
  findClientMenus,
  formatMenuForClient,
  generateMenuHTML,
} = require('../controllers/menus');

const GLOBAL_CLIENT_ID = process.env.clientID;
const menusRouter = express.Router();

menusRouter.get('/', (req, res) =>
  findClientMenus(GLOBAL_CLIENT_ID)
    .then(menus => res.send({ success: true, data: menus }))
    .catch(err => res.send({ success: false, err })));

menusRouter.get('/items', (req, res) =>
  findClientMenuItems(GLOBAL_CLIENT_ID)
    .then(items => res.send({ success: true, data: items }))
    .catch(err => res.send({ success: false, err })));

menusRouter.get('/:id', async (req, res) => {
  const formattedMenu = await formatMenuForClient(GLOBAL_CLIENT_ID, req.params.id);
  return res.send(formattedMenu);
});

menusRouter.get('/menu-section/:id', (req, res) =>
  generateMenuHTML(req.params.id)
    .then(data => res.send(data))
    .catch(err => res.send({ success: false, err })));

module.exports = menusRouter;
