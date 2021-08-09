const { Model } = require('objection');

class Categories extends Model {

    static get tableName() {
        return 'categories';
    }

    static get idColumn() {
        return 'id';
    }


    static get jsonSchema() {
        return {
            type: 'object',
            required: [],

            properties: {
                id: { type: number },
                name: { type: string },
                createdAt: { type: string },
            
            }
        };
    }


    
}

module.exports = Categories;
