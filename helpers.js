'use stict';

var chalk = require('chalk');
var fs = require('fs');
var readPkg = require('read-pkg-up').sync;
var shell = require('shelljs');
var stripEof = require('strip-eof');

var Helpers = {
	capitalize: function (str) {
		return str.charAt(0).toUpperCase() + str.slice(1);
	},

	checkDirectory: function (dir) {
		if (!fs.existsSync(dir)) {
			this.error('no such file or directory: ' + dir, 1);
		}

		if (!fs.statSync(dir).isDirectory()) {
			this.error('not a directory: ' + dir, 1);
		}
	},

	checkGitExec: function () {
		if (!shell.which('git')) {
			this.error('Missing required executable: git', 127);
		}
	},

	checkGitRepo: function () {
		this.log('Checking if "' + chalk.cyan(shell.pwd()) + '" is a Git repository ...');
		var rs = shell.exec('git rev-parse');
		if (rs.code !== 0) {
			this.error(stripEof(rs.stderr), 1);
		}
	},

	error: function (msg, code) {
		var err = chalk.red.bold;
		console.log(err(msg));
		console.log(err('Aborting.'));
		process.exit(code);
	},

	format: function (commits, component) {
		var str = component ? '## ' + component + '\n' : '';
		return str + commits.map(function (commit) {
			return '  * ' + commit;
		}).join('\n') + '\n\n';
	},

	getVersion: function () {
		var pkg = readPkg().pkg;
		var version = pkg && pkg.version || 'x.x.x';
		return version.replace('-pre', '');
	},

	log: function (msg) {
		if (!this.verbose) {
			return;
		}

		console.log(msg || '');
	},

	section: function (sect) {
		this.log();
		this.log(chalk.blue.bold('→ ') + chalk.magenta(sect));
		this.log();
	},

	today: function () {
		return new Date().toISOString().replace(/T.+/, '');
	}
};

module.exports = Helpers;
