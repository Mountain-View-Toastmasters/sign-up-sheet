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
