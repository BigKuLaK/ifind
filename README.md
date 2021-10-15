# Dev Workflow

1. Clone this repo and cd into the folder
2. Run `git config core.hooksPath .githooks` to ensure our githooks will be picked up  
3. Run `chmod -R +x .githooks` to ensure our githooks will execute

# Site Layers
The site has 3 different layers with their own individual folders for separation:

```
|-front-end
|-admin
|-api
```

Each layer has its own development and build setup, kindly refer to the `README.md` file of each layer for specific instructions.

