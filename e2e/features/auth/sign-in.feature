Feature: Sign in
  As a returning user
  I want to sign in
  So that I reach my counters

  # Uses TEST_USERNAME / TEST_PASSWORD; skips when unset.

  Scenario: Signing in lands on the counters home
    Given the test user opens the sign-in screen
    When the test user signs in with their credentials
    Then the user lands on the counters home
