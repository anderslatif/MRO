.PHONY: mysql postgresql sqlite all

mysql:
	@echo "Starting Docker Compose in mysql folder..."
	cd mysql && docker-compose up

access_mysql:
	@echo "Logging onto MySQL..."
	mysql -h 127.0.0.1 -P 3307 -uroot -proot_password

postgresql:
	@echo "Starting Docker Compose in postgresql folder..."
	cd postgresql && docker-compose up

access_postgresql:
	@echo "Logging onto PostgreSQL..."
	docker exec -it postgres_db psql -U postgres -d pagila

sqlite:
	@echo "Running createSQLiteDB.js in sqlite folder..."
	cd sqlite && node ./database/createSQLiteDB.js


all: mysql access_mysql postgresql access_postgresql sqlite
	