#!/usr/bin/bash

#HOST=192.168.1.181 DANGEROUSLY_DISABLE_HOST_CHECK=true npm run start
mkdir reactcert
mkcert -key-file ./reactcert/key.pem -cert-file ./reactcert/cert.pem $1
HOST=$1 npm run start-ssl
