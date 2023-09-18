### Project Description and Use Details:
This project tracks data on various foreign exchange currencies, updated as reference APIs update. The site can be navigated through use of the navbar at the top, and currencies/metrics can be selected through the dropdown menus on the 'Currency' page. Data takes time to update, as it is pulled asynchronously.

### <b>Team Members and Contributions</b>:
### Main Team Members: 
Charles, Jake, Louis, Sam
### Contributors: None

#### Resources:
https://getbootstrap.com/docs/4.0/components/navbar/
https://getbootstrap.com/docs/4.0/content/tables/
https://react-chartjs-2.js.org
https://react-select.com/home
https://testing-library.com/docs/ecosystem-react-select-event/

## Design Choices:

#### Interface Elements:
- We chose to use libraries for front-end UI elements, rather than making our own. Online libraries fit our needs for these elements, and there was no need to code complex front-end components by ourselves. Run 'npm test' after following the steps in 'Build and Run Program' to replicate this error.

### Data Structure(s):
- Front-end:
  - Uses the useMemo hook for currency data storage. This helps prevent unecessary API calls and ensures that the graphs/charts update when new data is provided.
  - Uses axios for ease of handling promises.
  - Stores color options in an array, so that highest-contrast colors can be used with the highest frequency.
- Back-end:
  - Uses Node.js to handle endpoint request and responses.
  - Uses axios for eas of setting up API calls to API Ninja API.
  - Stores inflation rate, interest rate, unemployment rate, corruption, and food dependency data.

### Errors/Bugs:
- Compatibility errors with testing library. Elaborated further in the testing section.
- If a currency is selected, and then quickly de-selected before the data has loaded, the currency will still load into the graph/table.

### Build and Run Program:
- Open terminal and navigate to the backend directory. 
- Run 'npm install' to install the needed dependencies.
- Once it is done installing, run 'npm start'. This will host the backend server on your device.
- Exit the backend directory, and navigate to the frontend directory.
- Run 'npm install' to install the needed dependencies.
- Once it is done installing, run 'npm start'. This will open the site in a browser tab, which you are then free to navigate.# Forex-assistant
