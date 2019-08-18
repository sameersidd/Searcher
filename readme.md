# Searcher

## Aggregates search results from different search engines

### To Install
- Clone this repo
- Create a config file (or env file) for the API Keys
- Link the config with `search.js`
- `npm install`

## Request:
Example:
```http
POST http://localhost:8080/search HTTP/1.1
Content-type: application/json

{
    "search": "Cats"
}
```
**search** key is required!

----

## To Do
- Add more search engines
- Aggregate the results according to value
- Add a trending results
- Make it faster