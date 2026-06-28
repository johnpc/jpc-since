@requires-deploy
Feature: Create and reset a counter
  As a signed-in user
  I want to create a counter and reset it
  So that I can track how long it's been since something — and start over

  # The count-up core: a fresh counter reads "just now"; after time passes it
  # counts up; resetting drops it back to ~now and logs the ended interval.
  # Each scenario creates its own counter and deletes it in teardown so reruns
  # against the one shared test user stay contention-free.

  Background:
    Given the test user opens the sign-in screen
    And the test user signs in with their credentials

  Scenario: A new counter appears on the home screen counting from just now
    When the test user creates a counter named "QA Haircut"
    Then the counter "QA Haircut" is shown counting up from seconds ago

  Scenario: Resetting a counter logs the interval and returns it to now
    Given the test user has a counter named "QA Oil Change"
    When the test user resets the counter "QA Oil Change"
    Then the counter "QA Oil Change" history shows at least one reset
