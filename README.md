Hobknob Toggle Logger for InfluxDB
---

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
    "env": "test"
  }
}
```
