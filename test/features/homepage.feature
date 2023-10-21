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
