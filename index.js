'use strict';
const child = require('child_process');
const fs = require('fs');
const path = require('path');
const flattenDeep = require('lodash.flattendeep');
const dottie = require('dottie');
const detectIndent = require('detect-indent');
const {html: beautify} = require('js-beautify');
const plist = require('plist');
const pSettle = require('p-settle');
const resolveFrom = require('resolve-from');
const semver = require('semver');
const stripIndents = require('common-tags/lib/stripIndents');
const unique = require('lodash.uniq');
const {Xcode} = require('pbxproj-dom/xcode');
const {list, log} = require('./util');

/**
 * Custom type definition for Promises
 * @typedef Promise
 * @property {*} result See the implementing function for the resolve type and description
 * @property {Error} result Rejection error object
 */

const env = {
	target: process.env.RNV && list(process.env.RNV)
};

/**
 * Returns default values for some options, namely android/ios file/folder paths
 * @private
 * @return {Object} Defaults
 */
function getDefaults() {
	return {
		android: 'android/app/build.gradle',
		ios: 'ios',
		incrementBuild: true,
		neverIncrementBuild: false,
		amend: true,
		neverAmend: false
	};
}

/**
 * Returns Info.plist filenames
 * @private
 * @param {Xcode} xcode Opened Xcode project file
 * @return {Array} Plist filenames
 */
function getPlistFilenames(xcode) {
	return unique(
		flattenDeep(
			xcode.document.projects.map(project => {
				return project.targets.filter(Boolean).map(target => {
					return target.buildConfigurationsList.buildConfigurations.map(config => {
						return config.ast.value.get('buildSettings').get('INFOPLIST_FILE').text;
					});
				});
			})
		)
	);
}

/**
 * Determines whether the project is an Expo app or a plain React Native app
 * @private
 * @return {Boolean} true if the project is an Expo app
 */
function isExpoProject(projPath) {
	try {
		const module = resolveFrom(projPath, 'expo');
		const appInfo = require(`${projPath}/app.json`);

		return Boolean(module && appInfo.expo);
	} catch (err) {
		return false;
	}
}

/**
 * Versions your app
 * @param {Object} program commander/CLI-style options, camelCased
 * @param {string} projectPath Path to your React Native project
 * @return {Promise<string|Error>} A promise which resolves with the last commit hash
 */
function version(program, projectPath) {
	const prog = {...getDefaults(), ...(program || {})};

	const projPath = path.resolve(process.cwd(), projectPath || prog.args[0] || '');

	const programOpts = {
		...prog,
		android: path.join(projPath, prog.android),
		ios: path.join(projPath, prog.ios)
	};

	const targets = [].concat(programOpts.target, env.target).filter(Boolean);
	const amend = programOpts.amend && !programOpts.neverAmend;
	const incrementBuild = programOpts.incrementBuild && !programOpts.neverIncrementBuild;
	let appPkg;

	try {
		resolveFrom(projPath, 'react-native');
		appPkg = require(path.join(projPath, 'package.json'));
	} catch (err) {
		if (err.message === "Cannot find module 'react-native'") {
			log({
				style: 'red',
				text: `Is this the right folder? ${err.message} in ${projPath}`
			});
		} else {
			log({
				style: 'red',
				text: err.message
			});

			log({
				style: 'red',
				text: "Is this the right folder? Looks like there isn't a package.json here"
			});
		}

		log({
			style: 'yellow',
			text: 'Pass the project path as an argument, see --help for usage'
		});

		if (program.outputHelp) {
			program.outputHelp();
		}

		process.exitCode = 1;
		return;
	}

	let appJSON;
	const appJSONPath = path.join(projPath, 'app.json');
	const isExpoApp = isExpoProject(projPath);

	if (isExpoApp) {
		log({text: 'Expo detected'}, programOpts.quiet);
	}

	try {
		appJSON = require(appJSONPath);

		if (isExpoApp) {
			appJSON = {
				...appJSON,
				expo: {...appJSON.expo, version: appPkg.version}
			};
		}
	} catch (err) {}

	let android;
	let ios;

	if (targets.length === 0 || targets.indexOf('android') > -1) {
		android = new Promise((resolve, reject) => {
			log({text: 'Versioning Android...'}, programOpts.quiet);

			let gradleFile;

			try {
				gradleFile = fs.readFileSync(programOpts.android, 'utf8');
			} catch (err) {
				if (!isExpoApp) {
					reject([
						{
							style: 'red',
							text: 'No gradle file found at ' + programOpts.android
						},
						{
							style: 'yellow',
							text: 'Use the "--android" option to specify the path manually'
						}
					]);
					return;
				}
			}

			if (!isExpoApp) {
				gradleFile = gradleFile.replace(
					/versionName (["'])(.*)["']/,
					'versionName $1' + appPkg.version + '$1'
				);
			}

			if (incrementBuild) {
				if (isExpoApp) {
					const versionCode = dottie.get(appJSON, 'expo.android.versionCode');

					appJSON = {
						...appJSON,
						expo: {
							...appJSON.expo,
							android: {
								...appJSON.expo.android,
								versionCode: programOpts.setBuild
									? programOpts.setBuild
									: versionCode
									? versionCode + 1
									: 1
							}
						}
					};
				} else {
					gradleFile = gradleFile.replace(/versionCode (\d+)/, (match, cg1) => {
						const newVersionCodeNumber = programOpts.setBuild
							? programOpts.setBuild
							: parseInt(cg1, 10) + 1;

						return 'versionCode ' + newVersionCodeNumber;
					});
				}
			}

			if (isExpoApp) {
				fs.writeFileSync(appJSONPath, JSON.stringify(appJSON, null, 2));
			} else {
				fs.writeFileSync(programOpts.android, gradleFile);
			}

			log({text: 'Android updated'}, programOpts.quiet);
			resolve();
		});
	}

	if (targets.length === 0 || targets.indexOf('ios') > -1) {
		ios = new Promise(resolve => {
			log({text: 'Versioning iOS...'}, programOpts.quiet);

			if (isExpoApp) {
				if (incrementBuild) {
					const buildNumber = dottie.get(appJSON, 'expo.ios.buildNumber');

					appJSON = {
						...appJSON,
						expo: {
							...appJSON.expo,
							ios: {
								...appJSON.expo.ios,
								buildNumber: programOpts.setBuild
									? programOpts.setBuild.toString()
									: buildNumber && !programOpts.resetBuild
									? `${parseInt(buildNumber, 10) + 1}`
									: '1'
							}
						}
					};
				}

				fs.writeFileSync(appJSONPath, JSON.stringify(appJSON, null, 2));
			} else {
				// Find any folder ending in .xcodeproj
				const xcodeProjects = fs
					.readdirSync(programOpts.ios)
					.filter(file => /\.xcodeproj$/i.test(file));

				if (xcodeProjects.length === 0) {
					throw new Error(`Xcode project not found in "${programOpts.ios}"`);
				}

				const projectFolder = path.join(programOpts.ios, xcodeProjects[0]);
				const xcode = Xcode.open(path.join(projectFolder, 'project.pbxproj'));
				const plistFilenames = getPlistFilenames(xcode);

				xcode.document.projects.forEach(project => {
					project.targets.filter(Boolean).forEach(target => {
						if (!incrementBuild) {
							return;
						}

						target.buildConfigurationsList.buildConfigurations.forEach(config => {
							if (target.name === appPkg.name) {
								let CURRENT_PROJECT_VERSION = 1;

								if (!programOpts.resetBuild) {
									CURRENT_PROJECT_VERSION =
										parseInt(
											config.ast.value.get('buildSettings').get('CURRENT_PROJECT_VERSION').text,
											10
										) + 1;
								}

								if (programOpts.setBuild) {
									CURRENT_PROJECT_VERSION = programOpts.setBuild;
								}

								config.patch({
									buildSettings: {
										CURRENT_PROJECT_VERSION
									}
								});
							}
						});
					});

					const plistFiles = plistFilenames.map(filename => {
						return fs.readFileSync(path.join(programOpts.ios, filename), 'utf8');
					});

					const parsedPlistFiles = plistFiles.map(file => {
						return plist.parse(file);
					});

					parsedPlistFiles.forEach((json, index) => {
						fs.writeFileSync(
							path.join(programOpts.ios, plistFilenames[index]),
							plist.build({
								...json,
								CFBundleShortVersionString: appPkg.version,
								...(incrementBuild
									? {
											CFBundleVersion: `${
												programOpts.resetBuild ? 1 : parseInt(json.CFBundleVersion, 10) + 1
											}`,
											...(programOpts.setBuild
												? {
														CFBundleVersion: programOpts.setBuild.toString()
												  }
												: {})
									  }
									: {})
							})
						);
					});

					plistFilenames.forEach((filename, index) => {
						/* eslint-disable camelcase */
						const indent = detectIndent(plistFiles[index]);

						fs.writeFileSync(
							path.join(programOpts.ios, filename),
							stripIndents`
							<?xml version="1.0" encoding="UTF-8"?>
							<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
							<plist version="1.0">` +
								'\n' +
								beautify(
									fs
										.readFileSync(path.join(programOpts.ios, filename), 'utf8')
										.match(/<dict>[\s\S]*<\/dict>/)[0],
									{
										end_with_newline: true,
										...(indent.type === 'tab'
											? {indent_with_tabs: true}
											: {indent_size: indent.amount})
									}
								) +
								stripIndents`
							</plist>` +
								'\n'
						);
						/* eslint-enable camelcase */
					});
				});

				xcode.save();
			}

			log({text: 'iOS updated'}, programOpts.quiet);
			resolve();
		});
	}

	return pSettle([android, ios].filter(Boolean))
		.then(result => {
			const errs = result
				.filter(item => {
					return item.isRejected;
				})
				.map(item => {
					return item.reason;
				});

			if (errs.length !== 0) {
				errs
					.reduce((a, b) => a.concat(b), [])
					.forEach(err => {
						if (program.outputHelp) {
							log({style: 'red', text: err.toString(), ...err}, programOpts.quiet);
						}
					});

				if (program.outputHelp) {
					program.outputHelp();
					return;
				}

				throw errs.map(errGrp => errGrp.map(err => err.text).join(', ')).join('; ');
			}

			const gitCmdOpts = {
				cwd: projPath
			};

			if (amend) {
				let latestTag = child
					.execSync('git describe --exact-match HEAD', gitCmdOpts)
					.toString()
					.trim();

				if (!semver.valid(latestTag)) {
					latestTag = null;
				}

				log({text: 'Amending...'}, programOpts.quiet);

				switch (process.env.npm_lifecycle_event) {
					case 'version':
						child.spawnSync(
							'git',
							['add'].concat(isExpoApp ? appJSONPath : [programOpts.android, programOpts.ios]),
							gitCmdOpts
						);

						break;

					case 'postversion':
					default:
						child.execSync('git commit -a --amend --no-edit', gitCmdOpts);

						if (!programOpts.skipTag && latestTag) {
							log({text: 'Adjusting Git tag...'}, programOpts.quiet);
							child.execSync(`git tag -af ${latestTag} -m ${latestTag}`, gitCmdOpts);
						}
				}
			}

			log(
				{
					style: 'green',
					text: 'Done'
				},
				programOpts.quiet
			);

			return child.execSync('git log -1 --pretty=%H', gitCmdOpts).toString();
		})
		.catch(err => {
			if (process.env.RNV_ENV === 'ava') {
				console.error(err);
			}

			log({
				style: 'red',
				text: 'Done, with errors.'
			});

			process.exitCode = 1;
		});
}

module.exports = {
	getDefaults,
	getPlistFilenames,
	isExpoProject,
	version
};
