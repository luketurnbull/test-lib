# Test PNPM package workflow

This is a test of the PNPM package workflow. And how I can quickly create a package and test it with examples.

# Building the package

To build the package, run the following command inside of the `lib` directory:

```bash
pnpm build
```

This will create a `dist` directory with the compiled code.

# Testing the package

To test the package, run the following command inside of the `client` directory:

```bash
pnpm dev
```

This will start a development server and open the application in your default browser. The package will be imported and used in the application. You can see the result in the browser.

# Development

To develop the package, you can use the following commands from `lib` directory:

```
pnpm watch
```

This will watch for changes in the source code and automatically rebuild the package.

To test the package, you can use the following commands from `client` directory:

```
pnpm dev
```
