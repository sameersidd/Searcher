const express = require("express");
const PORT = process.env.PORT || 8080;
const app = express();

app.use(express.json());

app.use("/search", require("./routes/search"));

//app.use("/images", require("./routes/images"));

app.listen(PORT, () => {
	console.log("Server started at " + PORT);
});
