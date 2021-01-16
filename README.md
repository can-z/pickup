# Pickup

## Local Dev

### Setting up the app locally

1. Make sure you have `npm`, `golang` and `yarn` installed.
1. `git clone` this repo.
1. in the `server/` folder, run `make restart`
1. in a new terminal window, in the `client/` folder, run `yarn`
1. run `yarn start`
1. Go to `http://localhost:3000` and you should be able to see the web app.
1. For subsequent startup of the server, you may run `./server` in the `server/` folder instead of `make restart` to save some time.

### Other useful `make` commands
- `make resetdb`: recreates local database with migration scripts applied.


### Visual Studio Plugins
- [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
- [sort-imports](https://marketplace.visualstudio.com/items?itemName=amatiasq.sort-imports)
- [Flow Language Support](https://marketplace.visualstudio.com/items?itemName=flowtype.flow-for-vscode)
