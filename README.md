# MVTM sign-up sheet scripts

## quickstart

To get dependencies including [clasp](https://github.com/google/clasp), run the
following command:

```
npm install
```

Use `clasp` for managing the scripts. Otherwise, you may use the following
commands for convenience.

```
# pull any changes from the sheet into the repo
npm run pull

# push any changes from the repo into the sheet
npm run push
```

All staged code will be formatted using [prettier in a pre-commit
hook](https://github.com/azz/pretty-quick#pre-commit-hook).


## Development Process and Testing out Changes

This process is still being fleshed out. There's some cowboying going on, but a safe route is listed below.

For now, if you want to test changes on sheets, you are advised to:

1. Check you have the latests changes from GitHub and the signup sheet. On a clean workspace:
    ```
        git checkout main
        git pull
        # Make sure things update smoothly
        npm run pull
        # Make sure there's no changes made - if so you'll need to figure out which is the right version - the version on GitHub or deployed on the spreadsheet. You can't move on to the next step until this is resolved
    ```
2. Create your branch for making changes. E.g.
    ```
        git checkout -b your-branch-name
    ```
3. First use the "Duplicate" button inside of Google Sheets to copy all the sheets you'll be affecting (mainly "Roles",
   "Sign-Up Sheet", and "ToastmasterDetails")
4. Next, update the `sheetnames.js` file to contain the new names, generally something like
    ```javascript
        // TODO(yourname): Return this back to normal before committing!
        // const SIGNUP_SHEET_NAME = "Sign-up Sheet";
        // const TM_DETAILS_SHEET_NAME = "ToastmasterDetails";
        // const ROLES_SHEET_NAME = "Roles";
        const SIGNUP_SHEET_NAME = "Copy of Sign-up Sheet";
        const TM_DETAILS_SHEET_NAME = "Copy of ToastmasterDetails";
        const ROLES_SHEET_NAME = "Copy of Roles";
        const ROSTER_SHEET_NAME = "Roster";
        const SIGNUP_TEMPLATE = "SignUp Template";
    ```
5. Make your changes, safely running the scripts knowing they won't affect the actual sheets (you may want to warn the
   VPE you'll be doing testing)
6. You can deploy them using `npm run push` as described above.
7. When you are satisfied, change the sheet names in `sheetnames.js` back to normal.
    ```javascript
        const SIGNUP_SHEET_NAME = "Sign-up Sheet";
        const TM_DETAILS_SHEET_NAME = "ToastmasterDetails";
        const ROLES_SHEET_NAME = "Roles";
        const ROSTER_SHEET_NAME = "Roster";
        const SIGNUP_TEMPLATE = "SignUp Template";
    ```
8. Commit and push up your changes to GitHub
    ```
        git add .
        git commit -m "$Replace this with a message about what you did"
        git push
    ```
9. Revert the changes on the Sign-Up Sheet back to the main branch on GitHub until you get things reviewed. From a clean
   workspace:
    ```
        git checkout main
        # check this is still the latest
        git pull
        npm run push
    ```
10. (Semi-optional) Verify things are back to normal the state before your changes.
11. Get your PR reviewed/be sure it's good to go. Merge it into main.
12. Deploy your changes from the main branch. From a clean workspace:
    ```
        git checkout main
        # pull the latest branch with your merged changes
        git pull
        npm run push
    ```
13. Verify things work as expected.
