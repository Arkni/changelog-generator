'use strict';

var preset = module.exports = function (commits) {
	return '  changes:\n' + commits.map(function (commit) {
		return '    - ' + commit;
	}).join('\n');
};

preset.header = '@RELEASE:\n  date: @DATE\n';
