import fs from 'fs';
import path from 'path';

export function findMatchingFile() {
	const dir = path.resolve('./');
	const files = fs.readdirSync(dir);
	const pattern = /.+_mro_migration\.js$/;
	const matches = files.filter((file) => pattern.test(file));
	
	return matches.length > 0 ? matches[0] : null;

}