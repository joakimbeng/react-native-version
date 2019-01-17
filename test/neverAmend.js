import test from 'ava';
import apiMacro from './helpers/apiMacro';
import cliMacro from './helpers/cliMacro';
import expected from './fixtures';
import npmScriptsMacro from './helpers/npmScriptsMacro';

test(
	'postversion',
	npmScriptsMacro,
	{postversion: '--never-amend'},
	'AwesomeProject',
	expected.version.default,
	expected.tree.notAmended
);

test(
	'postversion (Expo)',
	npmScriptsMacro,
	{postversion: '--never-amend'},
	'my-new-project',
	expected.version.default,
	expected.tree.notAmended
);

test(
	'version',
	npmScriptsMacro,
	{version: '--never-amend'},
	'AwesomeProject',
	expected.version.default,
	expected.tree.notAmended
);

test(
	'version (Expo)',
	npmScriptsMacro,
	{version: '--never-amend'},
	'my-new-project',
	expected.version.default,
	expected.tree.notAmended
);

test(
	'CLI',
	cliMacro,
	['--never-amend'],
	'AwesomeProject',
	expected.version.default,
	expected.tree.notAmended
);

test(
	'CLI (Expo)',
	cliMacro,
	['--never-amend'],
	'my-new-project',
	expected.version.default,
	expected.tree.notAmended
);

test(
	'API',
	apiMacro,
	{neverAmend: true},
	'AwesomeProject',
	expected.version.default,
	expected.tree.notAmended
);

test(
	'API (Expo)',
	apiMacro,
	{neverAmend: true},
	'my-new-project',
	expected.version.default,
	expected.tree.notAmended
);
