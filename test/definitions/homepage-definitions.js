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
  await browser.pause(1000);
});

When(/^I clear the value from the "([^"]*)"$/, async function (element) {
  await HomePage.clearValue(element);
});

Then(
  /^I validate that the "([^"]*)" "([^"]*)" reads: "([^"]*)"$/,
  async function (element, type, expectedText) {
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

Then(/^I wait for her to wake up$/, async function () {
  await HomePage.ioanaWakeUp();
});

When(
  /^I send a API request with the following params:$/,
  async function (dataTable) {
    let requestData = dataTable.rowsHash();
    await HomePage.sendApiRequest(requestData);
  }
);

Then(/^I validate that the response code is "([^"]*)"$/, function (code) {
  GenericApiActions.validateApiResponseCode(code);
});

Then(
  /^I validate that the value of the "([^"]*)" property is "([^"]*)" ?(in the json at index "([^"]*)"?)?$/,
  function (propertyName, expectedValue, index) {
    GenericApiActions.validatePropertyHasSpecificValue(
      propertyName,
      expectedValue,
      index
    );
  }
);
