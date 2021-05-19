SELECT 
  `TABLE_NAME`, -- Foreign key table
  `COLUMN_NAME` -- Foreign key column
FROM `INFORMATION_SCHEMA`.`KEY_COLUMN_USAGE`  
WHERE `TABLE_SCHEMA` = schema()
AND   `REFERENCED_TABLE_NAME` = 'cities'
AND   `REFERENCED_COLUMN_NAME` = 'city_id';

-- https://stackoverflow.com/questions/273794/mysql-how-to-determine-foreign-key-relationships-programmatically

SELECT CONCAT (REFERENCED_TABLE_NAME, '.', REFERENCED_COLUMN_NAME) AS fk
FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE 
WHERE REFERENCED_TABLE_SCHEMA = schema() 
  AND TABLE_NAME = "users"
  AND COLUMN_NAME = "city_id";