const puppeteer = require("puppeteer");
const chai = require("chai");
const expect = chai.expect;
const { Given, When, Then, Before, After } = require("cucumber");
const { clickElement, putText, getText } = require("../../lib/commands.js");

Before(async function () {
  const browser = await puppeteer.launch({ headless: false, slowMo: 50 });
  const page = await browser.newPage();
  this.browser = browser;
  this.page = page;
});

After(async function () {
  if (this.browser) {
    await this.browser.close();
  }
});

Given("this user visited the page {string}", async function (string) {
  return await this.page.goto(`http://qamid.tmweb.ru${string}`, {
    setTimeout: 20000,
  });
});

When("the user selects the day of the booking week {string}", async function (string) {
  await clickElement(this.page, `a:nth-child(${string})`);
});

When("the user selects the show time and movie title {string}", async function (sessionId) {
  await clickElement(this.page,`.movie-seances__time[href='#'][data-seance-id='${sessionId}']`);
});

When("the user has selected any free seat in the auditorium", async function () {
  return await clickElement(this.page, "span[class='buying-scheme__chair buying-scheme__chair_standart']");
});

When("the user clicks the «Reservation» button", async function () {
  return await clickElement(this.page, ".acceptin-button");
});

Then("sees the booking confirmation with the name of the movie {string}", async function (string) {
  const movieTitle = await getText(this.page, ".ticket__details.ticket__title");
  const expected = await string;
  expect(movieTitle).contains(expected);
});  

When("a user selects a seat in the hall that is not available for booking", async function () {
  return await clickElement(this.page, "span[class='buying-scheme__chair buying-scheme__chair_taken']");
});

Then("the user understands that the «Reservation» button is inactive", async function () {
  const acceptinButton = await this.page.$(".acceptin-button");
  const notAvailable = await acceptinButton.evaluate((btn) => btn.disabled);
  expect(notAvailable).to.be.true;
});