.PHONY: mysql postgresql sqlite all

mysql:
	@echo "Starting Docker Compose in mysql folder..."
	cd mysql && docker-compose up

postgresql:
	@echo "Starting Docker Compose in postgresql folder..."
	cd postgresql && docker-compose up

sqlite:
	@echo "Running createSQLiteDB.js in sqlite folder..."
	cd sqlite && node createSQLiteDB.js

all: mysql postgresql sqlite
	