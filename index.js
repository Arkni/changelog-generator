'use strict';

var readPkg = require('read-pkg-up').sync;
var stripEof = require('strip-eof');
var shell = require('shelljs');

function checkGitRepo() {
	shell.config.silent = true;
	var rs = shell.exec('git rev-parse');
	if (rs.code !== 0) {
		error(stripEof(rs.stderr), 1);
	}
}

function getTag() {
	var rs = shell.exec('git rev-list --tags --max-count=1');

	if (rs.code !== 0) {
		return '';
	}

	var commitHash = stripEof(rs.stdout);

	return stripEof(shell.exec('git describe --tags ' + commitHash).stdout);
}

function getLog(commitish) {
	var tag;
	var cmd;
	var rs;
	if (!commitish) {
		tag = getTag();
		commitish = tag && tag + '..HEAD';
	}

	cmd = 'git log ' + commitish + ' --no-merges --pretty=format:\'%s\'';
	rs = shell.exec(cmd);

	if (rs.code !== 0) {
		error(stripEof(rs.stderr), rs.code || 1);
	}

	return stripEof(rs.stdout);
}

function getVersion() {
	var pkg = readPkg().pkg;
	var version = pkg && pkg.version || 'x.x.x';
	return version.replace('-pre', '');
}

function today() {
	return new Date().toISOString().replace(/T.+/, '');
}

function format(commits, component) {
	var str = component ? '## ' + component + '\n' : '';
	return str + commits.map(function (commit) {
		return '  * ' + commit;
	}).join('\n') + '\n\n';
}

function error(msg, code) {
	console.error(msg);
	process.exit(code);
}

module.exports = function (opts) {
	opts = opts || {};
	if (opts.base) {
		process.chdir(opts.base);
	}

	checkGitRepo();

	var commits = getLog(opts.commitish).split(/\r?\n/);
	var release = opts.release || getVersion();
	var output = release + ' / ' + today() + '\n==================\n\n';
	var log;

	if (typeof opts.preset === 'string' && opts.preset.trim()) {
		try {
			log = require('./presets/' + opts.preset.toLowerCase())(commits);
			Object.keys(log).forEach(function (key) {
				output += format(log[key], key);
			});
		} catch (err) {
			error('ERROR: Preset: "' + opts.preset + '" does not exist', 1);
		}
	} else {
		output += format(commits);
	}

	return stripEof(output);
};
