'use strict';

var H = require('../helpers');

module.exports = function (commits) {
	var component;
	var log = {};
	var output = '';
	var regex = /^([^:]+):/;

	commits.forEach(function (commit) {
		if (regex.test(commit)) {
			component = H.capitalize(regex.exec(commit)[1]);
			commit = commit.replace(regex, '').trim();
		} else {
			component = 'Others';
		}

		if (!log[component]) {
			log[component] = [];
		}

		commit = H.capitalize(commit);
		log[component].push(commit.trim());
	});

	Object.keys(log).sort().forEach(function (key) {
		output += '## ' + key + '\n' + H.format(log[key]);
	});

	return output;
};
