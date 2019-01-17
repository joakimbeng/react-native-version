import test from 'ava';
import apiMacro from './helpers/apiMacro';
import cliMacro from './helpers/cliMacro';
import expected from './fixtures';
import npmScriptsMacro from './helpers/npmScriptsMacro';

test(
	'postversion',
	npmScriptsMacro,
	{postversion: '-a'},
	'AwesomeProject',
	expected.version.default,
	expected.tree.amended
);

test(
	'postversion (Expo)',
	npmScriptsMacro,
	{postversion: '-a'},
	'my-new-project',
	expected.version.default,
	expected.tree.amended
);

test(
	'version',
	npmScriptsMacro,
	{version: '-a'},
	'AwesomeProject',
	expected.version.default,
	expected.tree.amended
);

test(
	'version (Expo)',
	npmScriptsMacro,
	{version: '-a'},
	'my-new-project',
	expected.version.default,
	expected.tree.amended
);

test('CLI', cliMacro, ['-a'], 'AwesomeProject', expected.version.default, expected.tree.amended);

test(
	'CLI (Expo)',
	cliMacro,
	['-a'],
	'my-new-project',
	expected.version.default,
	expected.tree.amended
);

test(
	'API',
	apiMacro,
	{amend: true},
	'AwesomeProject',
	expected.version.default,
	expected.tree.amended
);

test(
	'API (Expo)',
	apiMacro,
	{amend: true},
	'my-new-project',
	expected.version.default,
	expected.tree.amended
);
