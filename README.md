### IPL Info
This is a project to provide a user the up-to-date information about the ongoing IPL season 2025. This doc explains the structure and functionality of the application in as much detail as possible.

Following are the components in the application:
#### Proxy fetcher
- It is a simple web application that interacts with the data provider APIs of [iplt20](https://www.iplt20.com). The sole reason this application exists is due to the fact that these people made it very hard to scrape the data from their website, due to dynamic content being loaded and the node.js libraries were not able to parse the required data. Hence I did some digging through their source code and extracted the APIs that were useful for this project.
- However, the APIs were not returning standard JSON, but JSONP, which is essentially a JavaScript function call. It can't be parsed simply as JSON, so in order to access the data, I created a web page, appended the response of the JSONP request as a script tag, and defined my own function to execute in response. Now that function does all the handling, which means I can access the data from their API calls natively.
- Afterwards, I established a websocket connection using `socket.io` to the backend, and now my backend service can fetch the data from the proxy without the hassle of scraping.
#### Backend service
- The backend communicates via socket connection to the proxy fetcher web application.
- Whenever a request arrives at the backend, an event is sent to the proxy fetcher, which does the API call and returns the response via the websocket
- API call done to the backend now gets the response received from the websocket, but, after a bit of clean-up in order to avoid unnecessary work on the client side
#### UI client
- The UI client is an intuitive interface for the users to get all the statistics about the IPL matches going on.
- The client communicates with the backend via a request-response cycle. 
- Optionally, a websocket can also be opened with the backend in order to receive live notifications