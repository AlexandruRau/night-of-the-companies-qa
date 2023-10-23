Feature: Homepage

    @create-user
    Scenario: Create a user with a random username and email, then check that they are correctly added to the list
        #Navigate to the test environment
        Given I access the URL "http://localhost:3000/"
        Then I validate that the "Title" "text" reads: "User List"
        # Fill in mandatory fields
        When I write a random email in the email field
        And I write a random name in the username field
        # Create user and validate its entry to the list
        And I click on the "Create User Button"
        Then I validate that the email was added to the list successfully