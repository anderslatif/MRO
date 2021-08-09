exports.up = function(knex) {
    
    knex.schema.createTable('categories', (table) => {
        table.uuid('id').primary().notNull();
        table.string().notNull();
        table.timestamp().defaultTo(knex.fn.now()).unsigned();

    });
        
    knex.schema.createTable('cities', (table) => {
        table.uuid('city_id').primary().notNull();
        table.string().notNull();

    });
        
    knex.schema.createTable('inttypes', (table) => {
        table.integer().unsigned().unique();
        table.integer().unsigned().unsigned();

    });
        
    knex.schema.createTable('test_multiple_fk', (table) => {
        table.uuid('id').primary().notNull();

    });
        
    knex.schema.createTable('users', (table) => {
        table.uuid('id').primary().notNull();
        table.string().unsigned();
        table.integer().unsigned().foreign('city_id').references('cities.city_id').foreign('city_id').references('test_multiple_fk.id');

    });
            
};

exports.down = function(knex) {
    return knex.schema
           .dropTable('categories')
           .dropTable('cities')
           .dropTable('inttypes')
           .dropTable('test_multiple_fk')
           .dropTable('users');
};
