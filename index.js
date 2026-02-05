const http = require("http");
const url = require("url");
const fs = require("fs");

const countries = require("./data/countries.js");
const menu = require("./data/menu.js");
const port = 9090;

const navigation = (menu) => {
  let navMenu = "<nav>";
  menu.forEach((item) => {
    if (item === "Home") {
      navMenu += `<a href='/'>${item}</a> `;
    } else {
      navMenu += `<a href='/${item.toLowerCase().replace(/\s+/g, "")}'>${item}</a> `;
    }
  });
  navMenu += "</nav>";
  return navMenu;
};

const headerHome = () => {
  return "<h1>Explore the world!</h1>";
};

const bodyHome = () => {
  return "<p>Check the countries in every part of the world on this site.</p>";
};

const headerContinent = (continentName) => {
  return `<h1>Explore ${continentName}!</h1>`;
};

const contentContinent = (continentName) => {
  let simpleContinentName = normalizedString(continentName);
  let continentDescription;
  try {
    continentDescription = fs.readFileSync(`./content/${simpleContinentName}.txt`);
  } catch (err) {
    continentDescription = "Content error, file does not exist";
  }
  return `<p>${continentDescription}</p>
  <h3>Here is the list of all the countries that are in ${continentName}.</h3>`;
};

const headerCountry = (country) => {
  return `<header><h2>Welcome to ${country.name}!</h2></header>`;
};

const contentCountry = (country) => {
  return `
    <h3>Here are the most important facts about ${country.name}:</h3> 
    <p>Country: ${country.name}</p>
    <p>Capital: ${country.capital}</p>
    <p>Located in: ${country.continent}</p>
    `;
};

const footer = () => {
  return "<footer><p>Made by Signe</p></footer>";
};

const normalizedString = (string) => {
  return string.toLowerCase().replace(/\s+/g, "");
};

const searchFailed = () => {
  return "<h1>Your search was not successful, return to the Homepage!</h1>";
};

http.createServer((req, res) => {
    const path = req.url;
    let fullPath = url.parse(path, true);
    const queries = fullPath.query;
    let urlPath = fullPath.pathname;
    const simpleNavPath = normalizedString(urlPath.slice(1));
    let continentName = menu.find((item) =>
      normalizedString(item) === simpleNavPath);
    const countryObject = countries.find((country) =>
      normalizedString(country.name) === simpleNavPath);

    res.writeHead(200, "Response successful", {"content-type": "text/html"});
    res.write(navigation(menu));

    if (fullPath.pathname === "/") {
      if (queries.country || queries.continent) {
        if (queries.country && queries.continent) {
          const queryMatch = countries.find((country) =>
            normalizedString(country.name) === normalizedString(queries.country) && 
            normalizedString(country.continent) === normalizedString(queries.continent)); 

          if (queryMatch) {
            res.write(`<h2>Search match for ${queryMatch.name} located in ${queryMatch.continent}</h2>`);
            res.write(contentCountry(queryMatch));
          } else {
            res.write(searchFailed());
          }
        } else if (queries.country) { 
          const queryMatchCountry = countries.find((country) =>
            normalizedString(country.name) === normalizedString(queries.country)); 

          if (queryMatchCountry) {
            res.write(`<h1>Search match for ${queryMatchCountry.name}</h1>`);
            res.write(contentCountry(queryMatchCountry));
          } else {
            res.write(searchFailed());
          }
        } else if (queries.continent) {
          const queryMatchContinent = countries.filter((country) =>
            normalizedString(country.continent) === normalizedString(queries.continent));

            if (queryMatchContinent.length > 0) {
              res.write(`<h1>Search match for ${queryMatchContinent[0].continent}</h1>`);
              queryMatchContinent.forEach(country => {
              res.write(contentCountry(country));
              });
            } else {
            res.write(searchFailed());
          }
        }
      } else {
        res.write(headerHome());
        res.write(bodyHome());
      }
    } else if (continentName) {
      res.write(headerContinent(continentName));
      res.write(contentContinent(continentName));

      countries.forEach((country) => {
        if (country.continent === continentName) {
          res.write(`<pre><a href="/${normalizedString(country.name)}">${country.name}</a></pre>`);
        }
      });
    } else if (countryObject) {
      res.write(headerCountry(countryObject));
      res.write(contentCountry(countryObject));
    } else {
      res.write("<h1>404; No Content here!</h1>");
    }
    res.write(footer());
    res.end();

  }).listen(port, () => {
    console.log(`Listening on port ${port}`);
  });