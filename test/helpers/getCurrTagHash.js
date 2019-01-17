import {version as expected} from '../fixtures';
import execAsync from './execAsync';

/**
 * Returns a commit hash based on the latest tag
 * @param {Object} t Test Object
 * @return {string} Commit hash
 */
function getCurrTagHash(t) {
	return execAsync(`git rev-list -n 1 v${expected.default[t.context.testProject].version}`, {
		cwd: t.context.tempDir
	});
}

export default getCurrTagHash;
