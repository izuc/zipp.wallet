## Building

The code is a React app wrapped in the electron runtime.

```shell
npm install
npm run build
```

You can execute the local build in a development electron shell by running.

```shell
npm run start-electron
```

If you want to create the final packages for your platform you can package it using the details below. The `/out` folder will contain the executable for your platform when packaging completes.

### Windows

```shell
npm run package-win
```

### Mac

```shell
npm run package-mac
```

For local development, set the environment variable `MACOS_SKIP_NOTARIZATION=true` (or `MACOS_SKIP_NOTARISATION`).

### Linux

```shell
npm run package-linux
```

