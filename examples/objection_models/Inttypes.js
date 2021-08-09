const { Model } = require('objection');

class Inttypes extends Model {

    static get tableName() {
        return 'inttypes';
    }

    
    static get jsonSchema() {
        return {
            type: 'object',
            required: [],

            properties: {
                signedint: { type: number },
                unsignedint: { type: number },
            
            }
        };
    }


    
}

module.exports = Inttypes;
