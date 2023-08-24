const express = require("express");
const rateLimit = require("express-rate-limit");

const { ServerConfig } = require("./config");
const apiRoutes = require("./routes");

const app = express();

const limiter = rateLimit({
  windowMs: 2 * 60 * 1000,
  max: 3
})

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(limiter);

app.use("/api", apiRoutes);

app.listen(ServerConfig.PORT, () => {
  console.log(`Sucessfully started the server on PORT : ${ServerConfig.PORT}`);
});
