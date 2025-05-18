#!/bin/bash
# Fix permission for docker.sock
chmod 666 /var/run/docker.sock

# กลับไปใช้ user jenkins
exec gosu jenkins "$@"
