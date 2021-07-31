const {Message} = require('discord.js')
const mapFolder = require('map-folder')
const path = mapFolder(__dirname,{
    exclude : ['index.js']
})
/**
 * @callback commandCallback
 * @param {Message} msg
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
