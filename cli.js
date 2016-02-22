#!/usr/bin/env node

'use strict';

var changelog = require('./');
var meow = require('meow');

var cli = meow({
	help: [
		'Usage',
		'    $ changelog',
		'',
		'Options',
		'    -b, --base       Specify the path of the git repo. By default, all file paths are relative to process.cwd()',
		'    -c, --commitish  The commit-ish from which you want to generate the changelog. Default to `${latest-tag}..HEAD`',
		'    -p, --preset     The preset to use in order to generate the change log. `jquery` is the only available',
		'                     preset. If no preset is specified, then a simple changelog will be generated.',
		'    -r, --release    The version of the upcoming release. If not specified, the cli will read the version',
		'                     from `package.json`.',
		'    -h, --help       Display this notice',
		'',
		'Examples',
		'    $ changelog',
		'    $ changelog --base /home/github/changelog-generator',
		'    $ changelog -c 1.0.0..HEAD -p jquery -r 1.0.1'
	]
}, {
	alias: {
		b: 'base',
		c: 'commitish',
		h: 'help',
		p: 'preset',
		r: 'release'
	}
});

console.log(changelog(cli.flags));
