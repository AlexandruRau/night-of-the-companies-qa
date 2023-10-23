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

    @field-validations
    Scenario: Verify that the user cannot send a create user request without filling in both the username and the email fields
        # Navigate to the test environment
        Given I access the URL "http://localhost:3000/"
        Then I validate that the "Title" "text" reads: "User List"
        # Verify username error validation
        When I write a random email in the email field
        And I click on the "Create User Button"
        Then I validate that the "Username Field Error Message" "text" reads: "* required"
        # Verify email error validation
        When I clear the value from the "Email Field"
        When I click on the "Username Field"
        And I write a random name in the username field
        And I click on the "Create User Button"
        Then I validate that the "Email Field Error Message" "text" reads: "* required"
        # Verify error messages disappear when fields are properly filled in
        When I write a random email in the email field
        And I click on the "Create User Button"
        Then I validate that the "Email Field Error Message" is "not displayed"
        Then I validate that the "Username Field Error Message" is "not displayed"
        And I validate that the email was added to the list successfully
