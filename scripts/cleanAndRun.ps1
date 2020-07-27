docker stop $(docker ps -aq);
docker rm $(docker ps -aq);
docker build . -t microcade-server;
docker run -p 3001:3001 microcade-server;