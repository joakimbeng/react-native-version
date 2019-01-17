import test from 'ava';
import expected from './fixtures';
import npmScriptsMacro from './helpers/npmScriptsMacro';

test(
	'postversion',
	npmScriptsMacro,
	{postversion: '--skip-tag'},
	'AwesomeProject',
	expected.version.default,
	expected.tree.amended
);

test(
	'postversion (Expo)',
	npmScriptsMacro,
	{postversion: '--skip-tag'},
	'my-new-project',
	expected.version.default,
	expected.tree.amended
);

test(
	'version',
	npmScriptsMacro,
	{version: '--skip-tag'},
	'AwesomeProject',
	expected.version.default,
	expected.tree.amended
);

test(
	'version (Expo)',
	npmScriptsMacro,
	{version: '--skip-tag'},
	'my-new-project',
	expected.version.default,
	expected.tree.amended
);
