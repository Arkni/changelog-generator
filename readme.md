# changelog-generator [![Build Status](https://travis-ci.org/Arkni/changelog-generator.svg?branch=master)](https://travis-ci.org/Arkni/changelog-generator)

> Generate a simple changelog for your release.


## Install

```
$ npm install -g changelog-gn
```

## Usage

```
$ changelog --help

Usage
    $ changelog

Options
    -b, --base       Specify the path of the git repo. By default, all file paths
                     are relative to process.cwd()
    -c, --commitish  The commit-ish from which you want to generate the changelog.
                     Default to `${latest-tag}..HEAD`
    -p, --preset     The preset to use in order to generate the change log. You
                     can chose `jquery` or `node` presets. If no preset is specified,
                     then a simple changelog will be generated.
    -r, --release    The version of the upcoming release. If not specified, the cli
                     will read the version from `package.json`.
    -V, --verbose    Output more detailed information
    -h, --help       Display this notice

Examples
    $ changelog
    $ changelog --base /home/github/changelog-generator
    $ changelog -c 1.0.0..HEAD -p jquery -r 1.0.1
```

## Examples

```
$ changelog
1.0.0 / 2016-02-23
==================

  * 1.0.0
  * initial commit

$ changelog -c 1.0.0..HEAD -p jquery -r 1.0.1 -b /home/github/a-jq-project
1.0.1 / 2016-02-23
==================

## Core
  * Minor tweeks
  * Make objects iterable

## Event
  * Remove an internal argument
```

## License

MIT © [Brahim Arkni](https://github.com/Arkni)
