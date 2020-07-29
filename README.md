# microcade-server

Why collaborate when you can procrastinate?

# Developing Locally!

Nodemon doesn't seem to work with docker-compose

The best way I can see to dev is 3-fold

1. In one window, run `yarn build:watch`. This will watch-compile the SERVER TS files.
2. In another window, run `yarn dev`. This will reload the server when SERVER TS files change.
3. In a third window, run `yarn watch-ui`. This will watch-compile the CLIENT TS files.

- Don't use the port generated from this, use localhost:3001

# Credits

Tetris app: https://github.com/weibenfalk/react-tetris-starter-files
DinoRunner: https://github.com/TylerPottsDev/chrome-dino-replica
