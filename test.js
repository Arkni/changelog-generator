import execa from 'execa';
import fn from './';
import shell from 'shelljs';
import test from 'ava';
import {version} from './package.json';
import {writeFileSync} from 'fs';

const today = new Date().toISOString().replace(/T.+/, '');

const fixtureDefault = [
	version + ' / ' + today,
	'==================\n',
	'  * Another commit',
	'  * Core: minor tweeks',
	'  * Event: Remove an internal argument',
	'  * CSS: Don\'t name the anonymous swap function',
	'  * core: Make jQuery objects iterable\n'
].join('\n');

const fixtureJQuery = [
	'1.0.0 / ' + today,
	'==================\n',
	'## CSS',
	'  * Don\'t name the anonymous swap function\n',
	'## Core',
	'  * Minor tweeks',
	'  * Make jQuery objects iterable\n',
	'## Event',
	'  * Remove an internal argument\n',
	'## Others',
	'  * Another commit\n'
].join('\n');

test.before('Set up the test', () => {
	shell.config.silent = true;
	shell.rm('-rf', 'tmp');
	shell.mkdir('tmp');
	shell.cd('tmp');
	shell.exec('git init');

	shell.exec('git config --local user.name "Travis-CI"');
	shell.exec('git config --local user.email "test@example.org"');
	shell.exec('git remote add origin git@github.com:Arkni/changelog-generator.git');

	writeFileSync('test1', '');
	shell.exec('git add --all && git commit -m "core: Make jQuery objects iterable"');
	writeFileSync('test2', '');
	shell.exec('git add --all && git commit -m "CSS: Don\'t name the anonymous swap function"');
	writeFileSync('test3', '');
	shell.exec('git add --all && git commit -m "Event: Remove an internal argument"');
	writeFileSync('test4', '');
	shell.exec('git add --all && git commit -m "Core: minor tweeks"');
	writeFileSync('test5', '');
	shell.exec('git add --all && git commit -m "Another commit"');
});

test.after('cleanup', () => {
	shell.cd('..');
	shell.rm('-rf', 'tmp');
});

test('Changelog - default options', t => {
	const log = fn();
	t.is(log, fixtureDefault);
});

test('Changelog - jQuery preset', t => {
	const log = fn({
		release: '1.0.0',
		preset: 'jquery'
	});

	t.is(log, fixtureJQuery);
});

test('CLI - default options', async t => {
	const {stdout} = await execa('../cli.js');
	t.is(stdout, fixtureDefault);
});

test('CLI - jQuery preset', async t => {
	const {stdout} = await execa('../cli.js', ['-r=1.0.0', '-preset=jquery']);
	t.is(stdout, fixtureJQuery);
});
