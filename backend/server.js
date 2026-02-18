require("dotenv").config(); // MUST be first to load env vars before any other imports
const app = require("./app");
const databaseConnection = require("./cofiguration/databaseConfig");

const port = process.env.PORT;

app.listen(port, () => {
    console.log("server is running on port", port);
    databaseConnection();
});