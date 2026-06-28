@requires-deploy
Feature: Settings
  As a signed-in user
  I want a settings screen
  So that I can manage my account, preferences, and find support

  Background:
    Given the test user opens the sign-in screen
    And the test user signs in with their credentials

  Scenario: The settings screen shows account, preferences, and support
    When the test user opens settings
    Then the settings screen shows the support email
    And the settings screen shows a sign-out control
    When the test user chooses the "Most recent first" sort
    Then the "Most recent first" sort is selected
