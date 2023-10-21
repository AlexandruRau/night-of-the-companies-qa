Feature: Chess

@send-get-api-request
    Scenario: Send GET request to API Endpoint:
        When I send a API request with the following params:
            | baseURL       | https://dummyapi.io                                                        |
            | path          | /data/v1/user?limit=10                                                     |
            | requestMethod | GET                                                                        |
            | headers       | {"Content-Type": "application/json", "app-id": "61f2af0aca5357648688193d"} |
        Then I validate that the response code is "200"
        And I validate that the value of the "data[0].id" property is "60d0fe4f5311236168a109ca"

  @play-chess
  Scenario: As an Alex, I want to play chess with someone from Bacău
    Given I access the URL "https://www.chess.com/home"
    When I write "r_alexandrum@yahoo.com" in the "Username Field"
    And I write "secret" in the "Password Field"
    And I click on the "Login Button"
    When I click on the "New Game Button"
    And I click on the "Custom Dropdown"
    And I write "devinity10" in the "Opponent Field"
    And I press the "Enter" key
    And I click on the "Play Button"
    Then I wait for her to wake up
