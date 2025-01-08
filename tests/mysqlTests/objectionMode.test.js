import { expect } from 'chai';

import { envMySQL, envMySQLCredentials, envMySQLPort, envObjectionMode } from '../testUtil/setupEnvironment.js';

import { testRunCLI } from '../testUtil/testRunCLI.js';

import fs from 'fs';


describe('Test Objection Models creation for MySQL', () => {
	before('Run the CLI', () => {
		envMySQL();
        envMySQLCredentials();
		envMySQLPort();
		envObjectionMode();

		testRunCLI();
	});

	it('should create the models folder', () => {
        const folderExists = fs.existsSync('models');

		expect(folderExists).to.be.true;
	});

	it('should have the correct number of model files', () => {
        const modelFiles = fs.readdirSync('models');

        const modelCount = modelFiles.length;
        	
		const sakilaTableCount = 23;

		expect(modelCount).to.equal(sakilaTableCount);
	});

    it('should have a model file for the store table', () => {
        const modelFiles = fs.readdirSync('models');

        const expectedModels = [
            'Actor.js',
            'ActorInfo.js',
            'Address.js',
            'Category.js',
            'City.js',
            'Country.js',
            'Customer.js',
            'CustomerList.js',
            'Film.js',
            'FilmActor.js',
            'FilmCategory.js',
            'FilmList.js',
            'FilmText.js',
            'Inventory.js',
            'Language.js',
            'NicerButSlowerFilmList.js',
            'Payment.js',
            'Rental.js',
            'SalesByFilmCategory.js',
            'SalesByStore.js',
            'Staff.js',
            'StaffList.js',
            'Store.js'
          ];

          
          modelFiles.forEach((file) => {
            expect(expectedModels).to.include(file);
          });
    });

    it('should have valid classes in each model file', () => {
        const modelFiles = fs.readdirSync('models');
    
        modelFiles.forEach(async (fileName) => {
            const className = fileName.replace('.js', '');
            const { default: ModelClass } = await import(`../models/${fileName}`);
            
            expect(ModelClass).to.be.a('function');
            expect(ModelClass.name).to.equal(className);
        });
    });

});
