CREATE TABLE cities (
    city_id INT AUTO_INCREMENT PRIMARY KEY, 
    city_name VARCHAR(150) NOT NULL
);

CREATE TABLE test_multiple_fk (
    id INT AUTO_INCREMENT PRIMARY KEY
);

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY, 
    name VARCHAR(255), 
    city_id INT,
    FOREIGN KEY (city_id) REFERENCES cities(city_id), 
    FOREIGN KEY (city_id) REFERENCES test_multipe_fk(id) 
);

CREATE TABLE various_texts (
    binaries BINARY(4), 
    VARBINARY(12), tiny_blob TINYBLOB, 
    characters CHAR(8), 
    long_text LONGBLOB, 
    medium_text MEDIUMTEXT, 
    text TEXT(120),
);

CREATE TABLE various_things (  
    blob BLOB(1024), tiny_text TINYTEXT, 
    medium_blob MEDIUMBLOB, 
    enums ENUM(bad, okay, good), 
    character_set SET('a', 'b', 'c')
);

CREATE TABLE jsonsupport (
    my_json JSON
)