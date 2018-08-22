const _ = require('lodash');

const ItemSchema = require('../../models/item');
const MenuSchema = require('../../models/tag');

const findClientMenus = (clientID, menuID) => new Promise(
  (resolve, reject) => {
    const searchQuery = { clientID };
    if (menuID) searchQuery.id = menuID;
    MenuSchema.find(searchQuery, {}, (err, menus) => {
      if (err) {
        return reject(err);
      }
      const menu = JSON.parse(JSON.stringify(menus));
      return resolve(menu);
    });
  },
);

const findClientMenuItems = clientID => new Promise(
  (resolve, reject) => {
    ItemSchema.find({ clientID }, {}, (err, items) => {
      if (err) {
        return reject(err);
      }
      const formattedItems = JSON.parse(JSON.stringify(items));
      return resolve(formattedItems);
    });
  },
);

const formatMenuForClient = (clientID, menuID) => {
  const requests = [
    findClientMenus(clientID, menuID),
    findClientMenuItems(clientID, menuID),
  ];
  console.log(`formatMenuForClient(${clientID}, ${menuID})`);
  return Promise.all(requests).then(([menus, items]) => {
    const menu = menus[0];
    const formattedMenuData = {
      header_title: menu.name,
      header_img: menu.header_img,
      subsections: [{ items: [] }],
    };
    _.forEach(menu.submenus, (submenu) => {
      formattedMenuData.subsections.push({ title: submenu, items: [] });
    });
    _.forEach(items, (item) => {
      _.forEach(item.tags, (tag) => {
        _.forEach(formattedMenuData.subsections, (subsection) => {
          if (tag === menu.name && item.subsection === subsection.title) {
            subsection.items.push(item);
          }
        });
      });
    });
    return {
      success: true,
      data: formattedMenuData,
    };
  }).catch(err => ({ success: false, err }));
};

module.exports = {
  findClientMenus,
  formatMenuForClient,
};
