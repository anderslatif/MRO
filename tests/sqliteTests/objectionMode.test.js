import { expect } from 'chai';

import { envSQLite, envDbPath, envJSONMode, envObjectionMode } from '../testUtil/setupEnvironment.js';

import { testRunCLI } from '../testUtil/testRunCLI.js';

import fs from 'fs';


describe('Test Objection Models creation for SQLite', () => {
	before('Run the CLI', () => {
        envSQLite();
        envDbPath();
        envJSONMode();
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
        	
		const sqliteTableCount = 11;

		expect(modelCount).to.equal(sqliteTableCount);
	});

    it('should have a model file for the store table', () => {
        const modelFiles = fs.readdirSync('models');

        const expectedModels = [
            'Album.js',
            'Artist.js',
            'Customer.js',
            'Employee.js',
            'Genre.js',
            'Invoice.js',
            'InvoiceLine.js',
            'MediaType.js',
            'Playlist.js',
            'PlaylistTrack.js',
            'Track.js'
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
