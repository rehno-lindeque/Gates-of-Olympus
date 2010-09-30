#!/bin/sh
coffee --no-wrap -c scenejsclouddome.coffee
coffee --no-wrap -c global.coffee
coffee --no-wrap -c common.coffee
coffee --no-wrap -c resources.coffee
coffee --no-wrap -c creatures.coffee
coffee --no-wrap -c proxies.coffee
coffee --no-wrap -c scene.coffee
coffee --no-wrap -c timeline.coffee
coffee --no-wrap -c events.coffee
coffee -c main.coffee
