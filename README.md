# News API

## Installation & Set Up

To run this project locally you must supply the correct environment variables that
point towards the databases locally.

Create two new files in the root of the project directory:

1. .env.development
2. .env.test

Next, add the names of the local development and test databases:

1. Add PGDATABASE=nc_news to the .env.development file.
2. Add PGDATABASE=nc_news_test to the .env.test file.
