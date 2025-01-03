# Escape from Tarkov - Task Graph Visualization

This browser local webapp visualizes the task dependency graph of the [Escape from Tarkov](https://www.escapefromtarkov.com/).  
You may also connect your Tarkov Tracker profile with an [API token](https://tarkovtracker.io/settings) to add your own progress to the graph.

Data sources:
 - [Tarkov.dev API](https://tarkov.dev/api/) for task list and dependencies.
 - [Tarkov Tracker API](https://tarkovtracker.github.io/TarkovTracker/) for user progress.

## How to build

### Install dependencies
```bash
npm install
```

### Run in development mode
```bash
npm run dev
```

### Build for production
```bash
npm run build
```
