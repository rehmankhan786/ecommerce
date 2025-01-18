const Router = require("express").Router();
const categoryCtrl = require('../controller/categoryCtrl'); 
const { auth } = require("../middlewares/auth");

Router.get('/',categoryCtrl.get)
Router.post('/add',categoryCtrl.add)
Router.post('/update:pCode',categoryCtrl.update)
Router.delete('/delete/:pCode',categoryCtrl.delete)
module.exports = Router;