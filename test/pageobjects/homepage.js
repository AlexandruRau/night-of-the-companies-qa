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
    if (inputValue === 'secret') {
      inputValue = 'Cnsmw*wLL8K#^QHZI8Kk*Txu0XHv';
    }
    await $(selector).waitForClickable();
    await $(selector).setValue(inputValue);
  }

  async ioanaWakeUp() {
    await browser.pause(3000);
    await browser.url('https://www.chess.com/home');
    await browser.execute(() => {
      const messageBox = document.createElement('div');
      messageBox.style.position = 'fixed';
      messageBox.style.top = '50%';
      messageBox.style.left = '50%';
      messageBox.style.transform = 'translate(-50%, -50%)';
      messageBox.style.padding = '20px';
      messageBox.style.background = 'white';
      messageBox.style.border = '1px solid #ccc';
      messageBox.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
      messageBox.style.display = 'flex';
      messageBox.style.flexDirection = 'column';
      messageBox.style.alignItems = 'center';

      const textContainer = document.createElement('div'); // Container for text
      const text = document.createTextNode(
        "Sorry bub, Ioana's busy right meow"
      );
      textContainer.appendChild(text);
      textContainer.style.marginBottom = '10px'; // Adjust the margin as needed
      textContainer.style.fontSize = '18px'; // Set font size
      textContainer.style.fontWeight = 'bold'; // Set font weight
      textContainer.style.color = 'red'; // Set text color to red

      const image = document.createElement('img');
      image.src = 'https://i.imgur.com/LRL9HLe.png'; // Replace with your image URL
      image.alt = 'Image Description';

      messageBox.appendChild(textContainer); // Append the text container
      messageBox.appendChild(image);

      document.body.appendChild(messageBox);
    });

    // Add some delay to allow the message to be visible
    await browser.pause(5000);
  }
}
export default new HomePage();
