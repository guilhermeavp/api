@Echo Off
call npm run build
start docker build -t guilhermeavp/api:V1 .
exit