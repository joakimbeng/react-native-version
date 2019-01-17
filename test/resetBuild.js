import test from 'ava';
import apiMacro from './helpers/apiMacro';
import cliMacro from './helpers/cliMacro';
import expected from './fixtures';
import npmScriptsMacro from './helpers/npmScriptsMacro';

test(
	'postversion',
	npmScriptsMacro,
	{postversion: '-r'},
	'AwesomeProject',
	expected.version.resetBuild,
	expected.tree.buildNumber.amended
);

test(
	'postversion (Expo)',
	npmScriptsMacro,
	{postversion: '-r'},
	'my-new-project',
	expected.version.resetBuild,
	expected.tree.buildNumber.amended
);

test(
	'version',
	npmScriptsMacro,
	{version: '-r'},
	'AwesomeProject',
	expected.version.resetBuild,
	expected.tree.buildNumber.amended
);

test(
	'version (Expo)',
	npmScriptsMacro,
	{version: '-r'},
	'my-new-project',
	expected.version.resetBuild,
	expected.tree.buildNumber.amended
);

test(
	'CLI',
	cliMacro,
	['-r'],
	'AwesomeProject',
	expected.version.resetBuild,
	expected.tree.buildNumber.amended
);

test(
	'CLI (Expo)',
	cliMacro,
	['-r'],
	'my-new-project',
	expected.version.resetBuild,
	expected.tree.buildNumber.amended
);

test(
	'API',
	apiMacro,
	{resetBuild: true},
	'AwesomeProject',
	expected.version.resetBuild,
	expected.tree.buildNumber.amended
);

test(
	'API (Expo)',
	apiMacro,
	{resetBuild: true},
	'my-new-project',
	expected.version.resetBuild,
	expected.tree.buildNumber.amended
);
