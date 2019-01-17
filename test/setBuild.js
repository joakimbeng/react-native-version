import test from 'ava';
import apiMacro from './helpers/apiMacro';
import cliMacro from './helpers/cliMacro';
import expected from './fixtures';
import npmScriptsMacro from './helpers/npmScriptsMacro';

test(
	'postversion',
	npmScriptsMacro,
	{postversion: '-s 33'},
	'AwesomeProject',
	expected.version.setBuild,
	expected.tree.amended
);

test(
	'postversion (Expo)',
	npmScriptsMacro,
	{postversion: '-s 33'},
	'my-new-project',
	expected.version.setBuild,
	expected.tree.amended
);

test(
	'version',
	npmScriptsMacro,
	{version: '-s 33'},
	'AwesomeProject',
	expected.version.setBuild,
	expected.tree.amended
);

test(
	'version (Expo)',
	npmScriptsMacro,
	{version: '-s 33'},
	'my-new-project',
	expected.version.setBuild,
	expected.tree.amended
);

test(
	'CLI',
	cliMacro,
	['-s', '33'],
	'AwesomeProject',
	expected.version.setBuild,
	expected.tree.amended
);

test(
	'CLI (Expo)',
	cliMacro,
	['-s', '33'],
	'my-new-project',
	expected.version.setBuild,
	expected.tree.amended
);

test(
	'API',
	apiMacro,
	{setBuild: 33},
	'AwesomeProject',
	expected.version.setBuild,
	expected.tree.amended
);

test(
	'API (Expo)',
	apiMacro,
	{setBuild: 33},
	'my-new-project',
	expected.version.setBuild,
	expected.tree.amended
);
