#!/bin/sh
coffee --no-wrap -c global.coffee
coffee --no-wrap -c resources.coffee
coffee --no-wrap -c proxies.coffee
coffee --no-wrap -c scene.coffee
coffee -c main.coffee
