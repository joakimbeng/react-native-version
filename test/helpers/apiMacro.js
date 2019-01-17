import {version} from '../..';
import beforeEach from './beforeEach';
import getCurrCommitHash from './getCurrCommitHash';
import getCurrTagHash from './getCurrTagHash';
import getCurrTree from './getCurrTree';
import getCurrVersion from './getCurrVersion';
import tempInitAndVersion from './tempInitAndVersion';

export default async (t, params, testProject, expectedVersion, expectedTree) => {
	t.context.testProject = testProject;
	beforeEach(t);
	tempInitAndVersion();
	await version({...params, quiet: true}, t.context.tempDir);
	t.plan(3);
	t.deepEqual(getCurrVersion(t), expectedVersion[t.context.testProject]);
	t.deepEqual(await getCurrTree(t), expectedTree[t.context.testProject]);

	if (params.skipTag) {
		t.not(await getCurrTagHash(t), await getCurrCommitHash(t));
	} else {
		t.is(await getCurrTagHash(t), await getCurrCommitHash(t));
	}
};
