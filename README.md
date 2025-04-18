### IPL Info
This is a project to provide a user the up-to-date information about the ongoing IPL season 2025. This doc explains the structure and functionality of the application in as much detail as possible.

Following are the components in the application:
#### Backend service
- The backend service has the core logic to fetch data from the official IPL website that can be visited [here](https://www.iplt20.com/)
- Since scraping the website seemed very hard (spent 2 days worth of effort on this without any fruitful results), I resorted to dig up their APIs that were providing the data on the UI side
- I observed that there were three URLs, on the domain `ipl-stats-sports-mechanic.s3.ap-south-1.amazonaws.com` that were providing the required response, be it live match commentary, points table, or match schedule.
- These APIs, however, were not returning standard JSON formatted data that I could use directly. Instead, the data was being returned as JSONP (JSON with Padding, very poorly named as there's nothing to do with padding here) which was not usable in the standard format.
- The JSONP format is essentially a JavaScript function call returned in response. The function to be called is already written in the UI side code, and according to the data passed in the function parameters, the necessary action is taken.
- So I essentially did the same: wrote my own functions that would simply set the data received inside some pre-defined variables. For executing the JSONP response as a function call, I used the `eval` method. I know this is not the best implementation according to security standpoint, however since the response is being trusted by the IPL's official website, I guess I can trust that too.
- That's how the data is being `fetched` from the IPL's offical website.
#### UI client
- The UI client is an intuitive interface for the users to get all the statistics about the IPL matches going on.
- The client communicates with the backend via a request-response cycle. 
- Optionally, a websocket can also be opened with the backend in order to receive live notifications
#### How to run the project?
- Make sure you have `git` and `docker` installed on your machine.
- Clone the repository by running the following command:
```
git clone git@github.com:MohitR1999/ipl-info.git
```
- Inside the `backend` folder, create a `.env` file with the following content:
```
PORT=<Custom port for running the backend>
```
- An example would be:
```
PORT=5000
```
- Inside the `ipl-info-ui` folder, create a `.env` file with the following content:
```
NEXT_PUBLIC_BACKEND_HOST=<IP address of your local machine on which backend is running>
NEXT_PUBLIC_BACKEND_PORT=<Port on which backend is running>
```
- An example would be:
```
NEXT_PUBLIC_BACKEND_HOST=192.168.1.15
NEXT_PUBLIC_BACKEND_PORT=5000
```
- Now navigate back to the parent folder, `ipl-info`, and run the following command:
```
docker-compose up --build
```
- This will run the `backend` as well as the `ui` service. Navigate to `http://localhost:3000` to see the UI up and running. You can also use postman to hit API requests to the `backend`