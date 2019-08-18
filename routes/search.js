const router = require("express").Router();
const config = require("../config.json");
const request = require("request-promise-native");
const sanitize = require("sanitize-html");
const GoogleAPI = config.GOOGLE_API_KEY;
const SearchID = config.GOOGLE_SEARCHID;
const BingAPI = config.BING_API_KEY;

//TODO Fix this promises

router.post("/", (req, res) => {
	//Check if request body is empty
	if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
		res.json({
			Message: "Request sent an empty body"
		});
		return;
	}

	//Take in request body an check if
	//either search key sent an attribute
	let SearchInput = req.body.search;
	if (typeof SearchInput !== "string") {
		res.status(400).json({
			Message: "Please send only one query as a String"
		});
		return;
	}
	const SearchQuery = sanitize(SearchInput);

	//Or is empty
	if (typeof SearchQuery == "string" && SearchQuery == "") {
		res.status(400).json({
			Message: "Search param cannot be empty!"
		});
		return;
	}

	let items = {};

	//Resolve the results concurrently
	Promise.resolve([
		request(
			`https://www.googleapis.com/customsearch/v1?key=${GoogleAPI}&cx=${SearchID}&q=${SearchQuery}`,
			{ json: true }
		).then((data) => {
			items.GoogleResults = [];
			for (let i = 0; i < 5; i++) {
				//Taking top 5 results only
				let item = data.items[i];
				items.GoogleResults.push({
					Title: item.title,
					Link: item.link,
					Description: item.snippet
				});
			}
			console.log("Google results done");
		}),

		request(
			`https://api.cognitive.microsoft.com/bing/v7.0/search?q=${SearchQuery}`,
			{ headers: { "Ocp-Apim-Subscription-Key": BingAPI }, json: true }
		)
			.then((result) => {
				items.BingResults = [];
				for (let i = 0; i < 5; i++) {
					//Taking top 5 results only
					let item = result.webPages.value[i];
					items.BingResults.push({
						Title: item.name,
						Link: item.url,
						Description: item.snippet
					});
				}
				console.log("Bing results done");
			})
			.then(() => {
				res.json({
					Message: "Successful",
					Results: items
				});
			})
	]).catch((error) => {
		console.error("Error: ", error);
		res.status(500).json({
			Message: "Error"
		});
	});
});

module.exports = router;
