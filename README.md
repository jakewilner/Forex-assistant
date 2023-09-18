# sprint-3-jcheng59-skim453
jcheng59-skim453 team's sprint-3 repo
# Sprint 3 - Command Terminal Webapp

### Project Description and Use Details:
This project tracks data on various foreign exchange currencies, updated as reference APIs update. The site can be navigated through use of the navbar at the top, and currencies/metrics can be selected through the dropdown menus on the 'Currency' page. Data takes time to update, as it is pulled asynchronously.

### <b>Team Members and Contributions</b>:
### Main Team Members: 
cnugye85, jwilner2, lli115, skim453
### Contributors: None

#### Resources:
https://getbootstrap.com/docs/4.0/components/navbar/
https://getbootstrap.com/docs/4.0/content/tables/
https://react-chartjs-2.js.org
https://react-select.com/home
https://testing-library.com/docs/ecosystem-react-select-event/

#### Total Estimated Time:
~160 hours (40 per member)

#### Link to GitHub Repository:
https://github.com/cs0320-f2022/term-project-cnguye85-jwilner2-lli115-skim453

## Design Choices:

#### Interface Elements:
- We chose to use libraries for front-end UI elements, rather than making our own. Online libraries fit our needs for these elements, and there was no need to code complex front-end components by ourselves. Run 'npm test' after following the steps in 'Build and Run Program' to replicate this error.

### Data Structure(s):
- Front-end:
  - Uses the useMemo hook for currency data storage. This helps prevent unecessary API calls and ensures that the graphs/charts update when new data is provided.
  - Uses axios for ease of handling promises. XXXXXXXXXXX
  - Stores color options in an array, so that highest-contrast colors can be used with the highest frequency.
- Back-end:
  - Uses Node.js to handle endpoint request and responses.
  - Uses axios for eas of setting up API calls to API Ninja API.
  - Stores inflation rate, interest rate, unemployment rate, corruption, and food dependency data.

### Errors/Bugs:
- Compatibility errors with testing library. Elaborated further in the testing section.
- If a currency is selected, and then quickly de-selected before the data has loaded, the currency will still load into the graph/table.

## Testing:
We divided our testing into the following separate files:
- In the frontend directory: App.test.js
- In the backend directory: app.test.txt

#### Front-end testing:
- App render/Navbar:
  - Tests that the App renders properly, that buttons and text content are present on the page.
  - Checks that the pathname is correct, and that button presses change the pathname.
  - Checks that all pages render default text content properly, and can be navigated to through the navbar.
- Currency:
  - Checks that the dropdown is functional and can have selections made.
  - Confirms that page content updates as new options are selected.
  - Confirms that multiple objects can be selected at once, and page content continues to update.


#### Back-end testing:
- testing the app
  - Mocked responses using jest.mock and axios for the api calls to make sure that they were being called.
  - Mocked api responses and data for updating the Interest rate data.
  - Test that api calls we were and returning the correct code.


### Steps Needs to Run the Integration and Unit Tests:
<b>
The way our testing library compiles is incompatible with something in our code. After extensive research and various attempts at fixing it, the problem remained unsolved.<br/><br/>
</b>

### Build and Run Program:
- Open terminal and navigate to the backend directory. 
- Run 'npm install' to install the needed dependencies.
- Once it is done installing, run 'npm start'. This will host the backend server on your device.
- Exit the backend directory, and navigate to the frontend directory.
- Run 'npm install' to install the needed dependencies.
- Once it is done installing, run 'npm start'. This will open the site in a browser tab, which you are then free to navigate.# Forex-assistant
