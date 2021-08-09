const { Model } = require('objection');

class Users extends Model {

    static get tableName() {
        return 'users';
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
                cityId: { type: number },
            
            }
        };
    }


    static get relationMappings() {
        // fixme the variable and file name should be singular
        const Cities = require('./Cities');
        const TestMultipleFk = require('./TestMultipleFk');
      
      
        return {
        
            cities: {
                // fixme these relations need to be fixed
                relation: Model.BelongsToOneRelation,
                modelClass: Cities,
                join: {
                    from: 'users.city_id',
                    to: 'cities.city_id'
                }
            },
            testMultipleFk: {
                // fixme these relations need to be fixed
                relation: Model.BelongsToOneRelation,
                modelClass: TestMultipleFk,
                join: {
                    from: 'users.city_id',
                    to: 'test_multiple_fk.id'
                }
            }
        };
    }
}

module.exports = Users;
