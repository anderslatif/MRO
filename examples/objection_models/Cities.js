const { Model } = require('objection');

class Cities extends Model {

    static get tableName() {
        return 'cities';
    }

    static get idColumn() {
        return 'city_id';
    }


    static get jsonSchema() {
        return {
            type: 'object',
            required: [],

            properties: {
                cityId: { type: number },
                cityName: { type: string },
            
            }
        };
    }


    
}

module.exports = Cities;
