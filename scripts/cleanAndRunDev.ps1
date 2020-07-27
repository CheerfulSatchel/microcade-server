docker stop $(docker ps -aq);
docker rm $(docker ps -aq);
docker build . -t microcade-server:dev -f ./Dockerfile.dev;
docker run -p 3001:3001 microcade-server:dev;