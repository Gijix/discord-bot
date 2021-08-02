const {Message,Client} = require('discord.js')
const mapFolder = require('map-folder')
const path = mapFolder(__dirname,{
    exclude : ['index.js']
})
/**
 * @callback commandCallback
 * @param {Message} message
 * @param {Client} bot
 */
/**
 * @typedef command
 * @property {commandCallback} fn
 *@property {string} name
 */
/**
 * @type {command[]}
 */
const result = []

Object.entries(path.entries).forEach( (obj) => {
    result.push(require(obj[1].path))
})
module.exports = result
