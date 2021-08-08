# MRO

**M**odel **R**elations to **O**bjects

###### ORM but in reverse

Reads the schema of relational databases and outputs files in JSON or Javascript format. 


## Why

- You want to quickly generate an overview of your database. 

- You want to backup your database schema and version them.

- You prefer to define your database with SQL syntax. 

- You already have an existing database and don't want to spend additional time remodelling it in your ORM.

- If you aren't sure how to define migrations on certain column types in Knex.js

- If you aren't sure how to model your objects in Objection.js.

- Why not just try it for fun. It's really easy to use. 

## How to use

`npx mro`

And follow the prompts. Should be pretty straightforward. If something isn't then create an issue. 

Just run it where you want the file(s) to be output to. 


#### Supported formats

JSON (MYSQL datatypes):

```
{ 
    "schema": [
        {
            "table": "users",
            "columns": [
                {
                    "field": "id", // column name
                    "type": "int",                
                    "typeJS: "Number",
                    "null": "NO",
                    "default": null,
                    "key": "PRI",
                    "extra": "AUTO_INCREMENT"
                },
                  {
                    "field": "city_id",
                    "type": "int",                
                    "typeJS: "Number",
                    "null": "NO",
                    "default": null,
                    "key": "MUL",
                    "keyTo": ["city.id"] // allows multiple foreign keys per column
                    "extra": null
                }
            ]
        }
    ]
}
```


Knex migration:

http://knexjs.org/#Migrations-API

Objection model:

https://vincit.github.io/objection.js/guide/models.html#examples


## Create an issue

- If you experience bugs
- If you have feature requests 
- If you have general comments/feedback 

## Supported Databases

- Mysql

## Support for other languages/frameworks

If there is interest this might be done in the future.
