import fs from 'fs';
import path from 'path';
import {promisify} from 'util';

const testProjectsPath = path.join(__dirname, '../fixtures');

const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);

export default async () => {
	const files = await readdir(testProjectsPath, {});
	const stats = await Promise.all(files.map(file => stat(path.join(testProjectsPath, file))));
	return files.filter((_, index) => stats[index].isDirectory());
};
