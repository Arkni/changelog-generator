'use strict';

var chalk = require('chalk');
var H = require('./helpers');
var path = require('path');
var stripEof = require('strip-eof');
var shell = require('shelljs');

function getTag() {
	var rs = shell.exec('git rev-list --tags --max-count=1');

	if (rs.code !== 0) {
		return '';
	}

	var commitHash = stripEof(rs.stdout);
	rs = shell.exec('git describe --tags ' + commitHash);

	if (rs.code !== 0) {
		H.error(stripEof(rs.stderr.split(/\r?\n/)[0]), rs.code || 1);
	}

	return stripEof(rs.stdout);
}

function getLog(commitish) {
	var tag;
	var cmd;
	var rs;
	if (!commitish) {
		tag = getTag();
		commitish = tag && tag + '..HEAD';
	}

	H.log('Getting the list of commits...');
	cmd = 'git log ' + commitish + ' --no-merges --pretty=format:\'%s\'';
	rs = shell.exec(cmd);

	if (rs.code !== 0) {
		H.error(stripEof(rs.stderr.split(/\r?\n/)[0]), rs.code || 1);
	}

	return stripEof(rs.stdout);
}

module.exports = function (opts) {
	opts = opts || {};
	shell.config.silent = true;
	H.verbose = opts.verbose;

	H.section('Checking git repository');
	H.checkGitExec();

	var base = opts.base && opts.base.trim();
	if (base) {
		base = path.resolve(__dirname, base);
		H.checkDirectory(base);
		H.log('Changing working directory to ' + chalk.cyan(base) + '.');
		shell.cd(base);
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
	var commits = getLog(commitish).split(/\r?\n/);
	var release = opts.release || H.getVersion();
	var output = release + ' / ' + H.today() + '\n==================\n\n';

	H.section('Generating changelog');

	output += formater(commits);

	H.log(chalk.green('Done!') + '\n');

	return stripEof(output);
};
