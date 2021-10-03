const { Message, Client, Permissions } = require("discord.js"),
  mapFolder = require("map-folder"),
  path = mapFolder(__dirname, {
    exclude: ["index.js"],
  });
/**
 * @callback commandCallback
 * @param {Message} message
 * @param {Client} bot
 */
/**
 * @typedef command
 * @property {commandCallback} fn
 * @property {string} name
 * @property {string} description
 * @property {Permissions} permList
 */
/**
 * @type {command[]}
 */
const result = [];

Object.entries(path.entries).forEach((obj) => {
  result.push(require(obj[1].path));
});
module.exports = result;
