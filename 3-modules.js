//CommonJs , every file is module by default
//Modules - Encapsulated code (only share minimum)
const names = require('./4-names')
const sayHi = require('./5-utils')
const data = require('./3-intro');
require('./4-intro');

sayHi("Joana")
sayHi(names.jon)
sayHi(names.emma)