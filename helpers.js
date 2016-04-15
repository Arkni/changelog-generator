'use stict';

var execSync = require('child_process').execSync;
var fs = require('fs');
var chalk = require('chalk');
var readPkg = require('read-pkg-up').sync;
var semver = require('semver');
var stripEof = require('strip-eof');

module.exports = {
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
		this.exec('git --version', {stdio: 'ignore'}, 'Missing required executable: git');
	},

	checkGitRepo: function () {
		this.log('Checking if "' + chalk.cyan(process.cwd()) + '" is a Git repository ...');
		this.exec('git rev-parse', {stdio: ['ignore', 'ignore', 'pipe']});
	},

	error: function (msg, code) {
		var err = chalk.red.bold;
		console.log(err(msg));
		console.log(err('Aborting.'));
		process.exit(code);
	},

	exec: function (cmd, opts, msg) {
		try {
			var rs = execSync(cmd, opts);
			return rs && stripEof(rs).toString();
		} catch (e) {
			this.error(msg || stripEof(e.stderr).toString().split(/\r?\n/)[0], e.status || 1);
		}
	},

	format: function (commits) {
		return commits.map(function (commit) {
			return '  * ' + commit;
		}).join('\n') + '\n\n';
	},

	getHeader: function (header, release) {
		header = header || '{release} / {date}\n==================\n\n';
		return header
			.replace('{release}', release)
			.replace('{date}', this.today());
	},

	getHomePage: function () {
		var originUrl = this.exec('git config --get remote.origin.url');
		var regex = /^git@[^:]+:[^\/]+\/.+/i;

		if (regex.test(originUrl)) {
			originUrl = originUrl
				.replace(':', '/')
				.replace('git@', 'https://');
		}

		return originUrl.replace('.git', '/');
	},

	getLog: function (commitish, format) {
		var rs;
		var tag;
		format = format || '%s';

		if (!commitish) {
			tag = this.getTag();
			commitish = tag && tag + '..HEAD';
		}

		this.log('Getting the list of commits...');

		rs = this.exec('git log ' + commitish + ' --no-merges --pretty=format:"' + format + '"',
					{stdio: ['ignore', 'pipe', 'pipe']});
		if (!rs) {
			this.error('No commits found', 1);
		}

		return rs;
	},

	getTag: function () {
		var commithash;
		try {
			commithash = execSync('git rev-list --tags --max-count=1',
						{stdio: ['ignore', 'pipe', 'ignore']});
		} catch (e) {
			return '';
		}

		return this.exec('git describe --tags ' + commithash);
	},

	getVersion: function (release) {
		if (release) {
			if (semver.valid(release) === null) {
				this.warn('"' + release + '" is not valid semver. Using the one in `package.json`.\n');
			} else {
				return release;
			}
		}

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
	},

	warn: function (msg) {
		console.log(chalk.yellow('WARN: ' + msg));
	}
};
