const { Message } = require("discord.js");
/**
 *
 * @param {Message} message
 */
module.exports = async function (message) {};

/**
 * @type {Promise<string>}
 */
const promise = new Promise((resolve, reject) => {
  setTimeout(() => resolve("Hello world"), 200);
});
promise.then((value) => console.log(value))
