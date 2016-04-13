'use strict';

var path = require('path');
var chalk = require('chalk');
var stripEof = require('strip-eof');
var H = require('./helpers');

module.exports = function (opts) {
	opts = opts || {};
	H.verbose = opts.verbose;

	H.section('Checking git repository');
	H.checkGitExec();

	var base = opts.base && opts.base.trim();
	if (base) {
		base = path.resolve(process.cwd(), base);
		H.checkDirectory(base);
		H.log('Changing working directory to ' + chalk.cyan(base) + '.');
		process.chdir(base);
	} else {
		H.log('Using the current working directory as the base.');
	}

	H.checkGitRepo();

	H.section('Checking preset');

	var preset = opts.preset && opts.preset.trim() || '';
	var formater;
	if (preset) {
		try {
			formater = require('./presets/' + preset.toLowerCase());
		} catch (err) {
			H.error('ERROR: Preset `' + preset + '` doesn\'t exist', 1);
		}
		H.log('Using ' + preset + ' preset.');
	} else {
		H.log('Using default preset.');
		formater = H.format;
	}

	H.section('Gathering commits');

	var commitish = opts.commitish && opts.commitish.trim() || '';
	var commits = H.getLog(commitish, formater.format).split(/\r?\n/);

	H.section('Generating changelog');

	var release = H.getVersion(opts.release);
	var output = release + ' / ' + H.today() + '\n==================\n\n';
	output += formater(commits, H.getHomePage());

	H.log(chalk.green('Done!') + '\n');

	return stripEof(output);
};
