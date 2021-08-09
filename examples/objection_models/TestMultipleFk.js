const { Model } = require('objection');

class TestMultipleFk extends Model {

    static get tableName() {
        return 'test_multiple_fk';
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
            
            }
        };
    }


    
}

module.exports = TestMultipleFk;
