# Assignment 1 (JS Frameworks) - Build A Node Server #

## Task ## 
The task is to build a multiple page application with a server that delivers content based on the request/response protocol. No styling is required.

### Site structure ###
The site consists of:
- Homepage
- 6 pages dedicated to each continent (included in the Navigation Menu together with the Homepage)
- 198 pages dedicated to each country

### Navigating the Site ###
- Navigating to Homepage - /
- Navigating to any continent page - /continentname; e.g. /asia
- Navigating to any country page - /countryname; e.g. /sweden

### Search queries ###
- Searching any continent - /?continent=continentname; e.g. /?continent=asia
- Searching any country - /?country=countryname; e.g. /?country=australia
- Searching any country and continent- /?country=countryname&continent=continentname OR /?continent=continentname&country=countryname; e.g. /?country=australia&continent=oceania OR /?continent=europe&country=latvia
- Searching for query/ies that does/do not match or exist will display the "Your search was not successful, return to the Homepage!"
