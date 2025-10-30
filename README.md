# engineerview

An Electron application with React and TypeScript

## Recommended IDE Setup

- [VSCode](https://code.visualstudio.com/) + [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) + [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

## Project Setup

### Install

Open two folders in separate instances in VS Code.

In root folder execute:

```bash
$ npm install
```

In backend folder (./src/backend) execute:

```bash
$ pip install -r requirements.txt
$ pyinstaller --onefile --noconsole main.py
```

_Root_ folder is used to interface and build application
_Backend_ folder is used to engineer calculate

### Development

Fast test

```bash
$ npm run dev
```

Build then test

```bash
$ npm run start
```

### Build

```bash
# For windows
$ npm run build:win

# For macOS
$ npm run build:mac

# For Linux
$ npm run build:linux
```
