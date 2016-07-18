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
