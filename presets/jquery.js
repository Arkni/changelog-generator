'use strict';

module.exports = function (commits) {
	var regex = /^(\w+)\s*:/i;
	var log = {
		Others: []
	};
	var component;

	commits.forEach(function (commit) {
		component = 'Others';
		if (regex.test(commit)) {
			component = regex.exec(commit)[1];
			component = component.charAt(0).toUpperCase() + component.slice(1);
			commit = commit.replace(regex, '').trim();
			if (!log[component]) {
				log[component] = [];
			}
		}
		commit = commit.charAt(0).toUpperCase() + commit.slice(1);
		log[component].push(commit.trim());
	});

	return log;
};
