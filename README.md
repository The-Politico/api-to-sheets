# API To Sheets
An Express / AWS Lambda API with access to your Google Spreadsheets.

## Making A Google Service Account
In order to use this app, you're going to need to set up a service account in the Google API. This account will serve to handle permissions for individual files. Think of it as the Gmail account for a bot that runs this API. Want that bot to have access to a spreadsheet? Share it with it. Want it to have access to a whole directory of Spreadsheets automatically? You can share the directory with the bot too, and any spreadsheets made in it will be automatically shared.

To make a new service account, first you'll need a project in the developer console.
- Go to [the developer console](https://console.developers.google.com/iam-admin/iam).
- At the top header, you should see a dropdown to select a project. Choose one to go to its admin, or make a new one.
- On the left tab, go to `Service accounts`.
- Click `Create Service Account`.
- Give it a name and click `Create`
- Give it the role of `Editor` and click `Continue`.
- Click `Create Key` to get a one-time credentials file which you'll need to configure this app.

## Configuratoin

### Environment Variables
Make a copy of the env template to use for your variables.

```
$ cp .env.template .env
```

Open up `.env` and fill it out.

- GAPI_PRIVATE_KEY: This is found in the credentials file you received after making your service account (see [Making A Google Service Account]('#making-a-google-service-account')) under the `private_key` key. It should be copied completely from `"` to `"` with the `\n` characters included in the copy as well.
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
  "options": {} // The options to use for this sheet. See Sheet Options for more.
},
```

The API is deployed using GitHooks, so pushing a change to the `sheets.json` file will automatically run the deployment. You can check out the deployment status on [its AWS CodeStar dashboard](https://console.aws.amazon.com/codestar/home?region=us-east-1#/projects/api-to-sheets/dashboard).

### Authentication

API To Sheets comes with a optional token schema with both public and private tokens. The Public Token should be used for apps that are available to the public whereas the Private Token should only be used in cases with proper authentication. For example, you might want to be able to append rows to a sheet from a public app, but only read rows in that sheet from the admin behind a login screen.

Schemas can be set on global level (by using a shorthand) or on a per-method basis (by using an object with keys matching the method) like so:
```javascript
[
  {
      "id": "SHEET_ID_1"
      "auth": "public_token" // applies this auth schema to all methods
  },
  {
      "id": "SHEET_ID_2"
      "auth": {
        "read": "private_token", // applies this schema to only read requests
        "append": "public_token" // applies this schema to only append requests
      }
  },
]
```

Available authentication schemes are the following:
- `public_token`: Check to make sure the token provided in the `authentication` key matches the public token registered in the API Gateway environment variables.
- `private_token`: Check to make sure the token provided in the `authentication` key matches the private token registered in the API Gateway environment variables.

### Sheet Options

Options can also be set on a global or per-method basis using the same format as authentication.

| Option        | Description |  Type | Example
| ------------- |:-------------|:-----|:-----|
| `sanitize`    | Whether or not to sanitize the input (removing "=" from the beginning of cells). | Boolean | `true`

## The Request

Requests can be in either be of type `application/json` or `text/plain`, but either type should provide a parseable JSON string with the following options. Each method may also include more options.

| Option        | Acceptable Values |  Example |
| ------------- |:-------------|:-----|
| `method`     | See list of [methods]('#methods'). | "append" |
| `sheet`     | A slug or ID defined in [`sheets.json`]('./sheets.json'). In a strange case where a slug is the same as another sheet (which should never happen), the slug will take precedence. | "is-this-true-tipline" |
| `authorization` | "Token " + a token value (see [Authentication]('#authentication'))   | "Token 3Y7774gCZ8" |

## Methods
- [`append`]('#append')
- [`read`]('#read')

### Append
The `append` method will append data to the end of the sheet provided. The data should be provided as keys to the body of the request that map to the column names of the sheets. For example, if my sheet has a columns named `Name`, `Email`, and `Link`, then my request would look something like this:
```javascript
{
  "method": "append",
  "sheet": "is-this-true-tipline",
  "authorization": "Token 3Y7774gCZ8",
  "Name": "Andrew Briz",
  "Email": "abriz@politico.com",
  "Link": "http://example.com"
}
```

#### Response
The response will return a `200` "OK" response if the request was processed without error.

### Read
The `read` method provides a way to read data from a sheet. There are no extra options for the request body.

#### Response
The response will be a JSON array with each index corresponding to a row in the sheet after the header. The Google API does sometimes change the keys in the sheet so if there's data missing, you might want to inspect the whole response. For example, a column named "Test Key" on Google sheets will come through as "testkey" in the response. Given the example request in the [append]('#append') docs, a request for the same sheet would look like:
```javascript
[
  {
    // ...other Google API data
    "name": "Andrew Briz",
    "email": "abriz@politico.com",
    "link": "http://example.com"
  }
]
```

## Exceptions
If there are problems with your request you may see some of these errors.

| Status        | Message |  Description |
| ------------- |:-------------|:-----|
| 400   | Request needs a method and sheet. | These two options are required in the body. This is the first check in validting the request though, so if you're sure you've provided them it might speak to a bigger problem with the request (the server may be having trouble reading the body). |
| 400    | `____` is an invalid method. | The method provided is not a valid method. Valid methods include only what's in the [methods list](#Methods). |
| 400   | Sheet `____` not found in configuration file. | The slug or ID provided does not match anything in your `sheets.json` |
| 400 | Request requires an authentication token.   | The request also needs a value in the "authentication" key. Note that this is not an authentication |
| 403 | Invalid authentication token.   | The token you provided does not match the token in the environment variables. Make sure that if your `sheets.json` requires the `public_token` that you are passing in the `public_token`. Both public and private tokens are mutually exclusive. |
| 403 | Invalid service account permissions. | The service account associated with this API (see [Making A Google Service Account](#making-a-google-service-account)) has not been given the proper permissions to perform the action you're trying to perform. Make sure that you've shared the sheet with the service account and given it edit permissions if you're trying to write to it.|
| 500 | Something went wrong. | An all purpose error message with no handler. Check out the AWS logs for more infomation on the error. |

## Example Requests
### JavaScript Fetch (Append)
```javascript
fetch('https://YOUR_API_URL', {
  method: 'POST',
  headers: {
    'content-type': 'application/json',
  },
  body: JSON.stringify({
    method: 'append',
    sheet: 'is-this-true-tipline',
    authorization: 'Token 3Y7774gCZ8',
    "Name": "Andrew Briz",
    "Email": "abriz@politico.com",
    "Link": "http://example.com"
  }),
})
  .then(resp => {
    if (resp.ok) {
      // do something
    }
  })
  .catch(error => console.error(error));
}
```
