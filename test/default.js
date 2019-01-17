import test from 'ava';
import apiMacro from './helpers/apiMacro';
import cliMacro from './helpers/cliMacro';
import expected from './fixtures';
import npmScriptsMacro from './helpers/npmScriptsMacro';

test(
	'postversion',
	npmScriptsMacro,
	{postversion: ''},
	'AwesomeProject',
	expected.version.default,
	expected.tree.amended
);

test(
	'postversion (Expo)',
	npmScriptsMacro,
	{postversion: ''},
	'my-new-project',
	expected.version.default,
	expected.tree.amended
);

test(
	'version',
	npmScriptsMacro,
	{version: ''},
	'AwesomeProject',
	expected.version.default,
	expected.tree.amended
);

test(
	'version (Expo)',
	npmScriptsMacro,
	{version: ''},
	'my-new-project',
	expected.version.default,
	expected.tree.amended
);

test('CLI', cliMacro, [], 'AwesomeProject', expected.version.default, expected.tree.amended);

test('CLI (Expo)', cliMacro, [], 'my-new-project', expected.version.default, expected.tree.amended);

test('API', apiMacro, {}, 'AwesomeProject', expected.version.default, expected.tree.amended);

test('API (Expo)', apiMacro, {}, 'my-new-project', expected.version.default, expected.tree.amended);
