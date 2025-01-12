# MRO

[![NPM Version][npm-version-image]][npm-url]

[![Package Test](https://github.com/anderslatif/MRO/actions/workflows/linkPackageTestSQLite.yml/badge.svg?label=MRO%20Package%20Tests)](https://github.com/anderslatif/MRO/actions/workflows/linkPackageTestSQLite.yml) [![MySQL Test](https://github.com/anderslatif/MRO/actions/workflows/mysql.yml/badge.svg?label=MySQL%20Test)](https://github.com/anderslatif/MRO/actions/workflows/mysql.yml) [![PostgreSQL Test](https://github.com/anderslatif/MRO/actions/workflows/postgresql.yml/badge.svg?label=PostgreSQL%20Test)](https://github.com/anderslatif/MRO/actions/workflows/postgresql.yml) [![SQLite Test](https://github.com/anderslatif/MRO/actions/workflows/sqlite.yml/badge.svg?label=SQLite%20Test)](https://github.com/anderslatif/MRO/actions/workflows/sqlite.yml)


**M**odel **R**elations to **O**bjects

> ORM but in reverse

Reads the schema of relational database (MySQL/PostgreSQL/SQLite) and outputs to objects in JSON, Javascript or creates Knex migrations. 

---

## Why

- You want to quickly generate a JSON overview of your database.

- You want to create HTML docs for your database.

- You want to backup your database schema and version them.

- You prefer to define your database with SQL syntax.

- You already have an existing database and don't want to spend additional time remodelling it in your ORM.

- If you aren't sure how to define migrations on certain column types in Knex.js.

- If you aren't sure how to model your objects in Objection.js.

- Why not just try it for fun. It's really easy to use.

---

## How to use

```bash
$ npx mro
```

And follow the prompts. Should be pretty straightforward. If something isn't then create an issue. 

Just run it where you want the file(s) to be output to. 

![Cli Example](./examples/cli_example.png)

---

## Supported formats

[Examples are based on the example schema](/examples/example_schema.sql)

#### JSON:

[Check out the JSON example output file](/examples/jsonschema.json)

#### Knex.js: 

[Check out the Knex migration example output file](/examples/20210809039554_mro_migration.js)

[Learn More](http://knexjs.org/#Migrations-API)

#### Objection.js: 

[Check out the Objection examples models folder](/examples/objection_models)

[Learn More](https://vincit.github.io/objection.js/guide/models.html#examples)

---

## Possible Environment Variables

MRO tries to read from either the environment or a `.env` file if the file exists where it is run from.

If it finds any of the following key variations it skips the prompt for that value.


| **Prompt**                 | **Environment Variables**                                                                               | **Explanation**                                                                              |
|----------------------------|-------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------|
| **Database Type**          | `DATABASE_TYPE`, `DB_TYPE`                                                                           | `mysql`, `postgresql`, `sqlite`                                                           |
| **Host**                   | `DATABASE_HOST`, `DB_HOST`, `DB_SERVER`, `PG_HOST`, `POSTGRES_HOST`, `POSTGRESQL_HOST`, `SQL_HOST`   | Accepts both IP address and `localhost`                                                   |
| **User**                   | `DATABASE_USER`, `DB_USER`, `DB_USERNAME`, `PG_USER`, `POSTGRES_USER`, `POSTGRESQL_USER`, `USER`, `USERNAME` | Defines the username used for database authentication.                                     |
| **Password**               | `DATABASE_PASSWORD`, `DB_PASS`, `DB_PASSWORD`, `PG_PASS`, `PG_PASSWORD`, `POSTGRES_PASS`, `POSTGRES_PASSWORD`, `POSTGRESQL_PASS`, `POSTGRESQL_PASSWORD`, `PASSWORD` | Specifies the password for the database user.                                             |
| **Port**                   | `DATABASE_PORT`, `DB_PORT`, `PG_PORT`, `POSTGRES_PORT`, `POSTGRESQL_PORT`, `SQL_PORT`                | If not defined, it will prompt for and suggest the default port.                          |
| **Database Name**          | `DATABASE`, `DATABASE_NAME`, `DB_DATABASE`, `DB_NAME`, `PG_DATABASE`, `PG_DB`, `POSTGRES_DATABASE`, `POSTGRES_DB`, `POSTGRESQL_DATABASE`, `POSTGRESQL_DB` | Name of the database.                                                   |
| **Database Path**          | `DATABASE_PATH`, `DB_PATH`                                                                           | Specifies the file path for SQLite databases.                                             |
| **Output Format**          | `MRO_OUTPUT`, `MRO_OUTPUT_FORMAT`, `OUTPUT_FORMAT`                                                  | `json`, `html`, `knex`, `objection` |
| **Knex Module Syntax**     | `MRO_MODULE_SYNTAX`, `MODULE_SYNTAX`                                                                | Valid values: `ESM`, `CJS`                                                                          |
| **MySQL Keys to Keep**     | `ALL_KEYS`, `MRO_ALL_KEYS`                                                      | Used by the test suite. All keys will be included.                                         |
| **All Selected Tables**    | `ALL_TABLES`, `MRO_ALL_TABLES`                                                                      | Used by the test suite. All tables will be included.                                       |


MRO will **never** make changes to your database. Credentials are safe with MRO. 

---

## Tests

Extensive tests are run on every push to the repository.

This is done by using sample databases Chinook (SQLite), Sakila (MySQL) and Pagila (PostgreSQL). After the schema is read, all types of outputs are generated and compared to the expected output.

---

## Create an issue

- If you experience bugs
- If you have feature requests 
- If you have general comments/feedback 

---

[npm-version-image]: https://img.shields.io/npm/v/mro.svg
[npm-url]: https://www.npmjs.com/package/mro
[npm-install-size-url]: https://packagephobia.com/result?p=mro
