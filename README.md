Hobknob Toggle Logger for InfluxDB
---
[![Build Status](https://travis-ci.org/ve-interactive/hobknob-toggle-logger-influx.svg?branch=master)](https://travis-ci.org/ve-interactive/hobknob-toggle-logger-influx)

Uses [feature-hooks](https://github.com/opentable/hobknob#feature-hooks) in hobknob to write toggle change events to influxdb.

__Configuration__

`config.json`

```
{
  "host": "127.0.0.1",
  "port": 8086,
  "database": "my_database",
  "username": "user",
  "password": "password",
  "tags": {
    "env": "test"            // optional tags for the measurement
  },
  "prefix": "foo.bar"        // optional prefix for measurement names
}
```

__Hobknob Configuration__

```
  "hooks": [
    "foo/some/other/hook.js",
    "node_modules/hobknob-toggle-logger-influx/index.js"
  ]
```

__Measurements__

Writes measurements to influxdb in the following format:

`hobknob.<app-name>,toggle=<featurename>/<togglename>,user=<user> value="<value>" <timestamp>`

So if you have an app called: 'my-cool-app', and a (simple) toggle called 'my-cool-toggle' you'll get something like this:

`hobknob.my-cool-app,toggle=my-cool-toggle,user=me value="false" 1469028556621874800`

A category feature would look like this:

`hobknob.my-cool-app,toggle=my-category/my-cool-toggle,user=me value="false" 1469028556621874800`

Note the value is wrapped in quotes to force influxdb to treat it as a string (instead of a bool). This makes things simpler if you're using these measurements as annotations in grafana.

__Hooking to grafana__

Once you've got your measurements, you can add an annotation in grafana, with the following query:

`select toggle,"user",value from "hobknob.my-app" where $timefilter`
(note `user` is a reserved keyword in influx, so we have to wrap it in quotes)

Set the column mappings and you're done! I prefer to set `title = toggle`, `tags = value` and `text = user`.
