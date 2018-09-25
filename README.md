# API To Sheets
An express API with access to your Google Spreadsheets.

## Making A Google Service Account
In order to use this app, you're going to need to set up a service account in the Google API. This account will serve to handle permissions for individual files. Think of it as the Gmail account for a bot that runs this API. Want that bot to have access to a spreadsheet? Share it with it. Want it to have access to a whole directory of Spreadsheets automatically? You can share that with the bot too, and any spreadsheets made in it will be automatically shared.

To make a new service account, first you'll need a project in the developer console.
- Go to [the developer console](https://console.developers.google.com/iam-admin/iam).
- At the top header, you should see a dropdown to select a project. Choose one to go to its admin, or make a new one.
- On the left tab, go to `Service accounts`.
- Click `Create Service Account`.
- Give it a name and click `Create`
- Give it the role of `Editor` and click `Continue`.
- Click `Create Key` to get a one-time credentials file which you'll need to configure this app.

## Config

### Environment Variables
Make a copy of the env template to use for your variables.

```
$ cp .env.template .env
```

Open up `.env` and fill it out.

- GAPI_PRIVATE_KEY: This is found in the credentials file you received after making your service account (see [Making A Google Service Account]('#making-a-google-service-account')) under the `private_key` key. It should be copied completely from `"` to `"` with the `\n` characters as well.
- GAPI_CLIENT_EMAIL: This is also found in the service account credentials file under the `client_email` key.
- PUBLIC_TOKEN: This token will be used for authentication in public apps. See [Authentication]('#authentication') for more.
- PRIVATE_TOKEN: This token will be used for authentication in private apps. See [Authentication]('#authentication') for more.

### Sheets
This app is meant to be able to handle multiple sheets at once. These are configured in [`sheets.json`]('./sheets.json') using the following schema for each sheet:
```javascript
{
  "id": "", // the Id of the Google sheet found in the URL
  "slug": "test", // the slug to use for this API when referencing this sheet. These must be unique.
  "auth": "" // The authentication schema to use. See Authentication for more.
},
```

Each entry in this json file will translate to a new set of routes from which to manipulate it. See [Routes]('#routes') for more.

## Authentication

API To Sheets comes with a optional token schema with both public and private tokens. The Public Token should be used for apps that are available to the public whereas the Private Token should only be used in cases with proper authentication. For example, you might want to be able to append rows to a sheet from a public app, but only read rows in that sheet from the admin behind a login screen.
