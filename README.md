# MRO

**M**odel **R**elations to **O**bjects

###### ORM but in reverse

Reads the schema of relational database (MySQL) and outputs to objects in JSON or Javascript. 

## Why

- You want to quickly generate a JSON overview of your database.

- You want to create HTML docs for your database. 

- You want to backup your database schema and version them.

- You prefer to define your database with SQL syntax. 

- You already have an existing database and don't want to spend additional time remodelling it in your ORM.

- If you aren't sure how to define migrations on certain column types in Knex.js

- If you aren't sure how to model your objects in Objection.js.

- Why not just try it for fun. It's really easy to use. 

## How to use

```bash
$ npx mro
```

And follow the prompts. Should be pretty straightforward. If something isn't then create an issue. 

Just run it where you want the file(s) to be output to. 

![Cli Example](./examples/cli_example.png)

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


## Create an issue

- If you experience bugs
- If you have feature requests 
- If you have general comments/feedback 

## Supported Databases

- MySQL

## Support for other languages/frameworks

If there is interest this might be done in the future.
