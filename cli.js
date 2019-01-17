#!/usr/bin/env node
'use strict';
const program = require('commander');
const {list} = require('./util');
const pkg = require('./package');
const rnv = require('.');

const defaults = rnv.getDefaults();

program
	.version(pkg.version)
	.description(pkg.description)
	.arguments('[projectPath]')
	.option(
		'-a, --amend',
		'Amend the previous commit. Use "--never-amend" if you don\'t want to amend. Also, if the previous commit is tagged with a valid Semver version, react-native-version will update the Git tag pointing to this commit.',
		true
	)
	.option(
		'--skip-tag',
		'For use with "--amend", if you don\'t want to update Git tags. Use this option if you have git-tag-version set to false in your npm config or you use "--no-git-tag-version" during npm-version.'
	)
	.option('-A, --never-amend', "Don't amend the previous commit.", false)
	.option('-b, --increment-build', 'Only increment build number.', true)
	.option('-B, --never-increment-build', "Don't increment build number.", false)
	.option('-d, --android [path]', 'Path to your "android/app/build.gradle" file.', defaults.android)
	.option('-i, --ios [path]', 'Path to your "ios/" folder.', defaults.ios)
	.option('-q, --quiet', 'Be quiet, only report errors.')
	.option(
		'-r, --reset-build',
		'Reset build number back to "1" (iOS only). Unlike Android\'s "versionCode", iOS doesn\'t require you to bump the "CFBundleVersion", as long as "CFBundleShortVersionString" changes. To make it consistent across platforms, ' +
			pkg.name +
			' bumps both by default. You can use this option if you prefer to keep the build number value at "1" after every version change. If you then need to push another build under the same version, you can use "-bt ios" to increment.'
	)
	.option(
		'-s, --set-build <number>',
		"Set a build number. WARNING: Watch out when setting high values. This option follows Android's app versioning specifics - the value has to be an integer and cannot be greater than 2100000000. You cannot decrement this value after publishing to Google Play! More info at: https://developer.android.com/studio/publish/versioning.html#appversioning",
		parseInt
	)
	.option(
		'-t, --target <platforms>',
		'Only version specified platforms, eg. "--target android,ios".',
		list
	)
	.parse(process.argv);

rnv.version(program);
