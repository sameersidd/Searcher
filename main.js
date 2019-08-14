const express = require("express");
const PORT = process.env.PORT || 8080;
const app = express();

app.use(express.json());

app.use;

app.listen(PORT, () => {
	console.log("Server started at " + PORT);
});
