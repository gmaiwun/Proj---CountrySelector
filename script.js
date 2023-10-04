"use strict";

const btn = document.querySelector(".btn-country");
const countriesContainer = document.querySelector(".countries");

///////////////////////////////////////

/////////////////////////////////UI RENDERING

const renderCountry = function (data, className = "") {
  const languageCollection = [];
  Object.entries(data.languages).forEach((language) =>
    languageCollection.push(language[1])
  );

  const currencyCollection = [];
  Object.entries(data.currencies).forEach((currency) =>
    currencyCollection.push(currency[1].name)
  );
  const html = `
    <article class="country ${className}">
    <img class="country__img" src="${data.flags.svg}" />
    <div class="country__data">
      <h3 class="country__name">${data.name.common}</h3>
      <h4 class="country__region">${data.region}</h4>
      <p class="country__row"><span>👫</span>${(
        +data.population / 1000000
      ).toFixed(1)} million people</p>
      <p class="country__row"><span>🗣️</span>${languageCollection.join(
        " / "
      )}</p>
      <p class="country__row"><span>💰</span>${currencyCollection.join(
        " / "
      )}</p>
    </div>
  </article>
    `;
  countriesContainer.insertAdjacentHTML("beforeend", html);
  countriesContainer.style.opacity = 1;
};

/////////////////////////////////ASYNC DATA FETCH

const getCountryData = function (country) {
  /// Country 1
  fetch(`https://restcountries.com/v3.1/name/${country}`)
    .then((response) => response.json())
    .then((data) => {
      renderCountry(data[0]); // The main country is here. We continue to tap into more data by chaining
      console.log(data); /// How to drill through this data for an integrated map???
      const neighbors = [...data[0]?.borders];
      if (!neighbors) return; // guard clause
      /// Country 2
      neighbors.forEach((neighbor) => {
        fetch(`https://restcountries.com/v3.1/alpha/${neighbor}`)
          .then((response) => response.json())
          .then((data) => renderCountry(data[0], "neighbor"));
      });
    });
};
getCountryData("cameroon");

/////////////////////////////////Map Rendering

const map = L.map("map").setView([38.897957, -77.03656], 13);
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

//////////////////////////////Form Submission

document.querySelector("button").addEventListener("click", function (e) {
  e.preventDefault();
});
