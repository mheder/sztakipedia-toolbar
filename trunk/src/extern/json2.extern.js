/**
 * Partial extern declaration for 
 * <a href="https://github.com/douglascrockford/JSON-js/blob/master/json2.js">json2.js</a> 
 * to be used with the Closure compiler.
 * 
 * @author Illes Solt
 * 
 */
 
/**
 * @constructor
 */
function JSON() {}

/**
 * @constructor
 * @param {*} value
 * @param {*} replacer
 * @param {number} space
 * @return {string} The JSON fromatted string representing the <code>value</code>
 */
JSON.prototype.stringify = function (value, replacer, space) {};
