# User Stories 12 and 13: Matchday Entry and Calendar

## Summary

Add an administrator screen for entering a championship matchday and a public calendar for visitors. Follow the existing Angular components, services, French interface, and dashboard navigation.

## Implementation changes

- Add a typed match model matching the backend's `MatchDTO`. Extend the championship service to list championships and retrieve matches grouped by matchday; add a service method to submit a list of matches to `POST /journees`.
- Add an administrator dashboard page where the user selects a championship and matchday number, then adds or removes matches with home club, away club, and date and time. Offer only clubs belonging to the selected championship. Require complete fields, distinct clubs, and a positive matchday number; prevent repeated club participation within the submitted matchday.
- Submit the matchday as one list, with the selected championship ID and matchday number on each match. Show loading, success, and actionable error states, and disable submission while the request is in progress.
- Add a public calendar linked from the home page. Let visitors select a championship and view its matches grouped by matchday, ordered by date, with club names and match dates. Provide loading, empty, and error states; display an identifiable fallback if a club name cannot be resolved.
- Adjust Spring Security to allow unauthenticated `GET /championnats` and `GET /championnats/{id}/matches`, and restrict `POST /journees` to administrators. Keep championship creation restricted to administrators.

## Test plan

- Test service URLs and payloads, matchday validation and submission, and calendar grouping, championship selection, empty states, and failures.
- Test backend authorization for anonymous calendar access, administrator matchday submission, and rejection of other roles.
- Run the relevant Angular tests and build, plus the affected backend security tests. Verify the administrator and visitor flows together.

## Assumptions

- Match dates use the backend's local date-time format without a timezone suffix.
- This work covers scheduling and calendar viewing; entering results and match events belongs to later stories.
- Existing backend data and API contracts remain in place; the backend security adjustment is included as agreed.
