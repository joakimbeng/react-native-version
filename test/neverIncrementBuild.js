import test from 'ava';
import apiMacro from './helpers/apiMacro';
import cliMacro from './helpers/cliMacro';
import expected from './fixtures';
import npmScriptsMacro from './helpers/npmScriptsMacro';

test(
	'postversion',
	npmScriptsMacro,
	{postversion: '--never-increment-build'},
	'AwesomeProject',
	expected.version.neverIncrementBuild,
	expected.tree.buildNumber.amended
);

test(
	'postversion (Expo)',
	npmScriptsMacro,
	{postversion: '--never-increment-build'},
	'my-new-project',
	expected.version.neverIncrementBuild,
	expected.tree.buildNumber.amended
);

test(
	'version',
	npmScriptsMacro,
	{version: '--never-increment-build'},
	'AwesomeProject',
	expected.version.neverIncrementBuild,
	expected.tree.buildNumber.amended
);

test(
	'version (Expo)',
	npmScriptsMacro,
	{version: '--never-increment-build'},
	'my-new-project',
	expected.version.neverIncrementBuild,
	expected.tree.buildNumber.amended
);

test(
	'CLI',
	cliMacro,
	['--never-increment-build'],
	'AwesomeProject',
	expected.version.neverIncrementBuild,
	expected.tree.buildNumber.amended
);

test(
	'CLI (Expo)',
	cliMacro,
	['--never-increment-build'],
	'my-new-project',
	expected.version.neverIncrementBuild,
	expected.tree.buildNumber.amended
);

test(
	'API',
	apiMacro,
	{neverIncrementBuild: true},
	'AwesomeProject',
	expected.version.neverIncrementBuild,
	expected.tree.buildNumber.amended
);

test(
	'API (Expo)',
	apiMacro,
	{neverIncrementBuild: true},
	'my-new-project',
	expected.version.neverIncrementBuild,
	expected.tree.buildNumber.amended
);
