import child from 'child_process';
import {oneLine} from 'common-tags';

export default () => {
	child.execSync(oneLine`
		git init
		&& git config user.email "test@zor.arpa"
		&& git config user.name "Test Zor"
		&& git add .
		&& git commit -m "Initial commit"
		&& npm version major --ignore-scripts
		&& npm version major --ignore-scripts
		&& npm version major --ignore-scripts
		&& git checkout -q v2.0.0
		`);
	const output = child.execSync('npm version patch');
	if (process.env.DO_LOG_OUTPUT === '1') {
		console.log(output.toString());
	}
};
