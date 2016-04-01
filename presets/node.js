'use strict';

var preset = function (commits, homePage) {
	return commits.map(function (commit) {
		return '* ' + commit
		.replace(/([^:]+:)/, '**$1**')
		.replace(/(.*)___(.*)$/, '[[`$2`]](' + homePage + 'commit/$2) - $1');
	}).join('\n');
};

preset.format = '%s___%h';

module.exports = preset;
