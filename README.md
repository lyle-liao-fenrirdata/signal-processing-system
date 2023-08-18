## Get Started

_Orignal project cloned from Notus NextJS_

- Install NodeJS **LTS** version from <a href="https://nodejs.org/en/">NodeJs Official Page</a>
- Open Terminal
- Go to your file project (where you’ve unzipped the product)
- Run in terminal `npm install`
- Navigate to http://localhost:3000
- Check more about [Tailwind CSS](https://tailwindcss.com/)

## CSS Components

Notus NextJS comes with 120 Fully Coded CSS elements, such as [Alerts](https://www.creative-tim.com/learning-lab/tailwind/nextjs/alerts/notus?ref=nnjs-github-readme), [Buttons](https://www.creative-tim.com/learning-lab/tailwind/nextjs/buttons/notus?ref=nnjs-github-readme), [Inputs](https://www.creative-tim.com/learning-lab/tailwind/nextjs/inputs/notus?ref=nnjs-github-readme) and many more.

Please [check all of them here](https://www.creative-tim.com/learning-lab/tailwind/nextjs/alerts/notus?ref=nnjs-github-readme).

## /api/auth for External Site

**use THE_IP_OR_URL:THE_PORT/api/auth GET & POST methods only**

- GET (to get user's username, account, and role)

  - query parameter: token
    - example /api/auth??token=THE_JWT_TOKEN
  - body: none
  - returns:
    - 200 OK
      ```json
      {
        "ok": true,
        "user": {
          "username": "測試-管理者",
          "account": "admin",
          "role": "ADMIN", // three possible value ADMIN, USER, and GUEST
          "iat": 1692275895,
          "iss": "Fenrir Data Analysis", // always return this
          "exp": 1692362295
        }
      }
      ```
    - 400 Bad Request
      ```json
      {
        "ok": false,
        "error": "Expect 'token' query parameter." // or any server side or token parse error message
      }
      ```
    - 401 Unauthorized
      ```json
      {
        "ok": false,
        "error": "JWSInvalid: JWS Protected Header is invalid"
      }
      ```

- POST (to validate the token, confirm the token is signed by system)
  - query parameter: none
  - body: JSON format as follow
    ```json
    {
      "token": "THE_TOKEN"
    }
    ```
  - returns:
    - 200 OK
      ```json
      {
        "ok": true,
        "token": "THE_TOKEN" // this token will different from previous(POST body) because of different iat and exp.
      }
      ```
    - 400 Bad Request
      ```json
      {
        "ok": false,
        "error": "Expect 'token' property in body JSON format." // or any server side or token parse error message
      }
      ```
    - 401 Unauthorized
      ```json
      {
        "ok": false,
        "error": "Invalid token."
      }
      ```
