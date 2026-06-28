@requires-deploy
Feature: Authenticated journey (smoke)
  The canonical authenticated path — sign in, create a counter, reset it, and
  see the reset reflected in its history. Asserts on real rendered data while
  authenticated (not just URLs), so an auth-only regression can't pass it.

  Scenario: Sign in, create, reset, and see history
    Given the test user opens the sign-in screen
    And the test user signs in with their credentials
    Then the user lands on the counters home
    When the test user creates a counter named "QA Smoke"
    Then the counter "QA Smoke" is shown reading "just now"
    When the test user resets the counter "QA Smoke"
    Then the counter "QA Smoke" history shows at least one reset
