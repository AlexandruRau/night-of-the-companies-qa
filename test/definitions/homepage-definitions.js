import { Given, When, Then } from '@wdio/cucumber-framework';
import HomePage from '../pageobjects/homepage.js';

Given(/^I access the URL "([^"]*)"$/, async function (url) {
  await HomePage.openURL(url);
});

When(/^I wait for "([^"]*)" second(?:s)?$/, async function (seconds) {
  await browser.pause(seconds * 1000);
});

Then(
  /^I wait for the "([^"]*)" to "([^"]*)"$/,
  async function (element, expectedState) {
    await HomePage.waitForElementToBeExpectedState(element, expectedState);
  }
);

When(/^I click on the "([^"]*)"$/, async function (element) {
  await HomePage.clickOnElement(element);
  await browser.pause(2000);
});

When(/^I clear the value from the "([^"]*)"$/, async function (element) {
  await HomePage.clearValue(element);
});

Then(
  /^I validate that the "([^"]*)" "([^"]*)" reads: "([^"]*)"$/,
  async function (element, type, expectedText) {
    await browser.pause(2000);
    await HomePage.validateExpectedTextOnElement(element, type, expectedText);
  }
);

Then(
  /^I validate that the "([^"]*)" is "([^"]*)"$/,
  async function (element, expectedState) {
    await HomePage.validateIfElementIsExpectedState(element, expectedState);
  }
);

When(
  /^I write "([^"]*)" in the "([^"]*)"$/,
  async function (inputValue, element) {
    await HomePage.fillInputField(inputValue, element);
    await browser.pause(1000);
  }
);

When(/^I press the "([^"]*)" key$/, async function (key) {
  await browser.pause(1000);
  await browser.keys(key);
  await browser.pause(1000);
});

When(
  /^I send a API request with the following params:$/,
  async function (dataTable) {
    let requestData = dataTable.rowsHash();
    await HomePage.sendApiRequest(requestData);
  }
);

Then(/^I validate that the response code is "([^"]*)"$/, function (code) {
  HomePage.validateApiResponseCode(code);
});

Then(
  /^I validate that the value of the "([^"]*)" property is "([^"]*)" ?(in the json at index "([^"]*)"?)?$/,
  function (propertyName, expectedValue, index) {
    HomePage.validatePropertyHasSpecificValue(
      propertyName,
      expectedValue,
      index
    );
  }
);

When(
  /^I store the "([^"]*)" of the "([^"]*)" inside "([^"]*)" property$/,
  async function (storeType, element, key) {
    await HomePage.storeElementText(storeType, element, key);
  }
);

When(/^I write a random name in the username field$/, async function () {
  await browser.pause(2000);
  await HomePage.fillUsernameField();
  await browser.pause(2000);
});

When(/^I write a random email in the email field$/, async function () {
  await browser.pause(2000);
  await HomePage.fillEmailField();
  await browser.pause(2000);
});

Then(
  /^I validate that the email was added to the list successfully$/,
  async function () {
    await HomePage.validateNewlyCreatedUser();
    await browser.pause(3000);
  }
);
