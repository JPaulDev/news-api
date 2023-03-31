<h1 align="center">News API</h1>

The project provides a simple and user-friendly interface that is built with
express and allows developers to easily integrate news articles into their own
applications or websites.

## Environment Variables

To run this project locally you must supply the correct environment variables that
point towards the test and development databases locally.

Create two new files in the root of the project directory:

1.  .env.development
2.  .env.test

Next, add the names of the local development and test databases:

1. Add PGDATABASE=nc_news to the .env.development file.
2. Add PGDATABASE=nc_news_test to the .env.test file.

## 🛠 Installation & Set Up

1.  Start by installing the dependencies

    ```bash
    npm install
    ```

2.  Create the database

    ```bash
    npm run setup-dbs
    ```

3.  Seed the database

    ```bash
    npm run seed
    ```

4.  Start the development server

    ```bash
    npm start
    ```

## Testing

The project is tested using jest with a combination of supertest to test that the
API endpoints are functioning correctly. To run the tests simply use:

    npm test

## Tech Stack

- <a href="https://expressjs.com/">Express</a>
- <a href="https://www.postgresql.org/">PostgreSQL</a>
- <a href="https://www.npmjs.com/package/supertest">Supertest</a>
- <a href="https://jestjs.io/">Jest</a>

## Live Demo

https://news-api-sjab.onrender.com/api/

## License

This project is licensed under the terms of the <strong><a href="https://choosealicense.com/licenses/mit/">MIT</a></strong> license.
