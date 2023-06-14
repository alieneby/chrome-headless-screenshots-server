#!/bin/sh
export DBUS_SESSION_BUS_ADDRESS=$(dbus-daemon --config-file=/usr/share/dbus-1/system.conf --print-address)
/usr/bin/chromium-browser  --headless --disable-extensions --disable-gpu --use-gl=swiftshader --disable-setuid-sandbox --disable-dev-shm-usage &
node server.js