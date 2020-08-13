# Changelog

## v0.4.0 

## v0.3.0 (13/08/2020)
- [V0.3.x (#52)](https://github.com/douyu/juno/commit/db79fb99f6e86b323207fafcb5ca1ef049884783) - @MEX7
- [Fix for issue #50](https://github.com/douyu/juno/commit/e5f4c7d9707be27d92e12376d1857d45d575c15f) - @Howie66

---

## v0.2.0 (21/07/2020)
## New Features
* Add oauth2 login github, gitlab @askuy
* Add clientproxy reload every minute @MEX7
* Add gateway proxy function and gateway setting function @link-duan
* Add proxy interface support single and multiple region proxy @askuy
* Add multiple region add proxy heartbeat add admin proxy stream request remove dead code @askuy
* Configuration center, display the current configuration version and change log of the instance @MEX7
* Provide OpenAPI for juno configuration center @link-duan 
* Provide system settings and access to Grafana monitoring panel @MEX7
* Use Casbin module, menu interface permission setting supports automatic check of permission points, support Hover to display permission details @link-duan
* Summary configuration of menu and interface permissions @link-duan
* Support global and private configuration resources @link-duan
* Support database clear install mock remove dead code support govern config @askuy
* Support multi-configuration path delivery and multi-configuration prefix monitoring @MEX7

## Optimization
* Core handle wrap context @askuy 
* Optimization monitoring center @MEX7
* Pprof remove go-torch dependency @askuy
* Remove useless code add debug logger @askuy 
* Change logger config add juno admin mock data  @askuy 
* Use environment and zone code to uniquely identify the computer room @MEX7
* Bind the availability zone selected by the application to the URL parameter @link-duan
* Optimized the configuration version information selection of the configuration release pop-up window @link-duan

## Bug Fixes
* Fix configuration release's error status @MEX7
* Fix the bug that the front-end menu Logo is blocked @link-duan
* Fix the Gitlab ID created by the application is a number @link-duan 
* Fix the abnormal display of the refresh list after deleting the configuration file @link-duan
* Fix the historical version of Diff confusion, when a new file is created, the previous file is automatically opened @link-duan
* Fix the exception of reloading list after PProf page is executed; when Host is not selected, all PPROF lists are loaded @link-duan
---

## 0.1.0 (23/06/2020)
* config
* monitor
---

## juno first version (05/06/2020)
[Quick Start](http://jupiter.douyu.com/juno/1.1quickstart.html#_1-1-2%E3%80%81%E5%AE%89%E8%A3%85%E6%AD%A5%E9%AA%A4)

