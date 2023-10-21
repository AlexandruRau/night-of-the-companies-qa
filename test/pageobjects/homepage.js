import supertest from 'supertest';
const chai = require('chai');
const chaiExpect = require('chai').expect;
let apiResponse;

class HomePage {
  obtainSelector(element) {
    let formattedElement = element.replace(/ |-/g, '_').toLowerCase();

    return {
      username_field: "[id='username']",
      password_field: "[id='password']",
      login_button: "[id='login']",
      new_game_button: "[class*='play-quick'] a:nth-child(2)",
      custom_dropdown: "button[class*='toggle-custom']",
      opponent_button: "[class*='custom-game-validation']",
      opponent_field: "[data-cy='user-selector-username-']",
      play_button: "[data-cy='new-game-index-play']",
    }[formattedElement];
  }

  async openURL(url) {
    await browser.url(url);
    await $("[class*='type_accept']").waitForClickable();
    await $("[class*='type_accept']").click();
  }

  /**
   * This functions waits for an element to be a specific state. Wait time is default and controlled in wdio.conf.local.js ("waitForTimeout:"). You can change it or overwrite it by adding a {timeout} parameter to the specific wait you want modified.
   * @param {string} element a selector, defined in hooks.js, e.g. "Login Button"
   * @param {string} expectedState a string indicating what state we expect our element to have (see full list of states)
   */
  async waitForElementToBeExpectedState(element, expectedState) {
    const selector = this.obtainSelector(element);

    switch (expectedState) {
      case 'be displayed':
      case 'be visible':
        await $(selector).waitForDisplayed();
        break;
      case 'not be displayed':
      case 'not be visible':
        await $(selector).waitForDisplayed({ reverse: true });
        // 'reverse: true' waits for the element to disappear
        break;
      case 'be present':
      case 'exist':
        await $(selector).waitForExist();
        break;
      case 'not be present':
      case 'not exist':
        await $(selector).waitForExist({ reverse: true });
        break;
      case 'be clickable':
        await $(selector).waitForClickable();
        break;
      case 'not be clickable':
        await $(selector).waitForClickable({ reverse: true });
        break;
      case 'enabled':
        await $(selector).waitForEnabled();
        break;
      case 'not enabled':
        await $(selector).waitForEnabled({ reverse: true });
        break;
      case 'focused':
        await $(selector).isFocused();
        break;
      case 'not focused':
        await $(selector).isFocused({ reverse: true });
        break;
      default:
        throw new Error(
          'Wrong expected state provided. Only use the following: be displayed, not be displayed, be visible, not be visible, be present, not be present, exist, not exist, be clickable, not be clickable, be enabled, not be enabled.'
        );
    }
  }

  async clickOnElement(element) {
    const selector = this.obtainSelector(element);
    await $(selector).waitForClickable();
    await $(selector).click();
  }

  async clearValue(element) {
    const selector = this.obtainSelector(element);
    await $(selector).clearValue();
  }

  /**
   * The if in this function allows us to use a collected value as an expected text in the feature file
   * One must write "$Var.<collectorKey>" as the expected text for this to work, e.g. "$Var.firstUsername"
   */
  async validateExpectedTextOnElement(element, type, expectedText) {
    const selector = this.obtainSelector(element);
    if (expectedText.includes('$Var.')) {
      let collectedText = getValueCollectorMap(expectedText.slice(5));
      expectedText = collectedText;
    }

    switch (type) {
      case 'text':
        await expect($(selector)).toHaveText(expectedText);
        break;
      case 'value':
        await expect($(selector)).toHaveValue(expectedText);
        break;
      default:
        throw new Error(
          'Wrong type provided. Please only use "text" and "value" as parameters.'
        );
    }
  }

  /**
   * This functions asserts that an element is a specific state.
   * @param {string} element a selector, defined in hooks.js, e.g. "Login Button"
   * @param {string} expectedState a string indicating what state we expect our element to have (see full list of states)
   */
  async validateIfElementIsExpectedState(element, expectedState) {
    const selector = this.obtainSelector(element);

    switch (expectedState) {
      case 'visible':
      case 'displayed':
        await expect($(selector)).toBeDisplayedInViewport();
        break;
      case 'not displayed':
      case 'not visible':
        await expect($(selector)).not.toBeDisplayedInViewport();
        break;
      case 'present':
      case 'existing':
        await expect($(selector)).toBePresent();
        break;
      case 'not present':
      case 'not existing':
        await expect($(selector)).not.toBePresent();
        break;
      case 'clickable':
        await expect($(selector)).toBeClickable();
        break;
      case 'not clickable':
        await expect($(selector)).not.toBeClickable();
        break;
      case 'enabled':
        await expect($(selector)).toBeEnabled();
        break;
      case 'not enabled':
        await expect($(selector)).not.toBeEnabled();
        break;
      case 'selected':
        await expect($(selector)).toBeSelected();
        break;
      case 'not selected':
        await expect($(selector)).not.toBeSelected();
        break;
      case 'focused':
        await expect($(selector)).toBeFocused();
        break;
      case 'not focused':
        await expect($(selector)).not.toBeFocused();
        break;
      default:
        throw new Error(
          'Wrong expected state provided. Only use the following: displayed, not displayed, visible, not visible, present, not present, existing, not existing, clickable, not clickable, enabled, not enabled, selected, not selected.'
        );
    }
  }

  /**
   * The if in this function allows us to send collected values in the "Write in field" step in the feature file
   * One must write "$Var.<collectorKey>" as the input value for this to work, e.g. "$Var.firstPassword"
   */
  async fillInputField(inputValue, element) {
    const selector = this.obtainSelector(element);
    if (inputValue.includes('$Var.')) {
      let collectedText = getValueCollectorMap(inputValue.slice(5));
      inputValue = collectedText;
    }
    await $(selector).waitForClickable();
    await $(selector).setValue(inputValue);
  }

  /**
   * This function sends an API request based on the provided parameters from an object. Please note that body is optional based of HTTP Request Method.
   * If logResponse is set to 'true', it will log the response body in console. If you don't want to show the response, instead of setting it to false,
   * just remove the line from the dataTable.
   * @param {object} requestData = {
    baseURL: 'https://dummyapi.io',
    path: `/data/v1/user?limit=10`,
    requestMethod: 'GET',
    headers:
      '{"Content-Type": "application/json", "app-id": "61f2af0aca5357648688193d"}',
    logResponse: 'true'
  };
   *
   * @returns {JSON} response
   */
  async sendApiRequest(requestData) {
    const request = supertest(requestData.baseURL);
    const headers = requestData.headers;
    const payload = requestData.body;
    const logResponse = requestData.logResponse;

    console.log(
      `Sending a ${requestData.requestMethod} request to ${requestData.baseURL}${requestData.path}. Waiting for response from API...`
    );
    switch (requestData.requestMethod) {
      case 'GET':
        apiResponse = await request
          .get(requestData.path)
          .set(JSON.parse(headers));
        break;
      case 'POST':
        apiResponse = await request
          .post(requestData.path)
          .set(JSON.parse(headers))
          .send(JSON.parse(payload));
        break;
      case 'PUT':
        apiResponse = await request
          .put(requestData.path)
          .set(JSON.parse(headers))
          .send(JSON.parse(payload));
        break;
      case 'PATCH':
        apiResponse = await request
          .patch(requestData.path)
          .set(JSON.parse(headers))
          .send(JSON.parse(payload));
        break;
      case 'DELETE':
        apiResponse = await request
          .delete(requestData.path)
          .set(JSON.parse(headers));
        break;
      default:
        throw new Error(
          'Wrong HTTP method provided. Only use one of the following: GET, POST, PUT, PATCH, DELETE.'
        );
    }
    if (logResponse === 'true') {
      console.log(
        '↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓ API Response ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓'
      );
      console.log(apiResponse.body);
    }
    return apiResponse;
  }

  /**
   * This function asserts that the response code received from the API is the desired one.
   * The error will contain the response code and the response body.
   * @param {number} code the expected response code (200, 201, 400, 403, 500 etc)
   */
  validateApiResponseCode(code) {
    if (apiResponse.status != code) {
      let responseBody = JSON.stringify(apiResponse.body);
      throw new Error(
        `Received response code ${apiResponse.status} but expected ${code}. Response body is: \n ${responseBody}`
      );
    } else {
      console.log(`API Response Code: ${apiResponse.status}`);
    }
  }

  /**
   * This function asserts that a property from the API response is equal to a specific value.
   * @param {string} propertyName e.g. data[0].id or just id
   * @param {string} expectedValue Can be a normal string, a number, null, or a collected value ("$Var.something") - we determine which it is using the clarifyExpectedValue() function
   * @param {number} index Optional parameter which allows for specifying the index at which the json is to be found in the response object
   */
  validatePropertyHasSpecificValue(propertyName, expectedValue, index) {
    expectedValue = this.clarifyExpectedValue(expectedValue);
    const responseBody = apiResponse.body;

    if (index) {
      chaiExpect(responseBody[index])
        .to.have.nested.property(propertyName)
        .to.equal(expectedValue);
    } else {
      chaiExpect(responseBody)
        .to.have.nested.property(propertyName)
        .to.equal(expectedValue);
    }
  }

  /**
   * This function determines what expected value should be used in the validatePropertyHasSpecificValue() function
   * @param {string} expectedValue Can be a normal string, a number, null, or a collected value ("$Var.something")
   */
  clarifyExpectedValue(expectedValue) {
    // If expectedValue is a number, parse and return it
    if (expectedValue / 1) {
      expectedValue = parseFloat(expectedValue);
      // If expectedValue is a collected value, retrieve and return it
    } else if (expectedValue.includes('$Var.')) {
      let collectedText = getValueCollectorMap(expectedValue.slice(5));
      expectedValue = collectedText;
      // If expectedValue is a "null" string, transform into the null value and return it
    } else if (expectedValue == 'null') {
      expectedValue = null;
    }

    return expectedValue;
  }
}
export default new HomePage();
