const Router = require("express").Router();
const userRouter = require("./userRoutes.js");
const productRouter = require("./productRouter.js");
const categoryRouter = require("./categoryRouter.js");
const adminRouter = require("./adminRouter.js")
const cartRoutes = require("./cartRoutes.js");

Router.use("/user", userRouter);
Router.use('/product',productRouter)
Router.use('/category',categoryRouter)
Router.use('/admin',adminRouter)
Router.use("/api/cart", cartRoutes);


module.exports = Router;
