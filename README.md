# dirliner

[![npm version](https://badge.fury.io/js/dirliner.svg)](https://badge.fury.io/js/dirliner)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](http://www.typescriptlang.org/)

## The Problem

In modern software development, you often need to share or upload code to various platforms - AI assistants, code review tools, documentation systems, or cloud services. Many of these platforms have a common limitation: they only accept individual files, not directories or folder structures. This creates a tedious workflow where you have to:

1. Manually navigate through each directory
2. Copy each file individually
3. Upload them one by one
4. Somehow keep track of which file came from where

For example, a typical React project structure:
```
Before:
src/
  ├── components/
  │   └── Button.tsx
  └── pages/
      └── about.tsx

After:
src-components-Button.tsx
src-pages-about.tsx
```

Dirliner solves this by automatically flattening your directory structure while preserving the path information in the filename, making it easy to share code with AI tools, code review platforms, or any system that only accepts individual files.

## Features

- 🚀 Both CLI and programmatic TypeScript API
- 🎯 Flexible ignore patterns (like .gitignore)
- 📁 Preserves file extensions and relationships
- 🔄 Recursive directory processing
- 📝 Detailed logging options
- ⚡ Fast and efficient
- 💪 Full TypeScript support
- 🛡️ Type-safe operations

## Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [CLI Usage](#cli-usage)
- [TypeScript API](#typescript-api)
- [Configuration](#configuration)
- [Ignore Patterns](#ignore-patterns)
- [Development](#development)
- [Troubleshooting](#troubleshooting)
- [License](#license)

## Installation

### Global Installation (CLI Usage)
```bash
# Using Yarn
yarn global add dirliner

# Using npm
npm install -g dirliner
```

### Local Installation (Programmatic Usage)
```bash
# Using Yarn
yarn add dirliner

# Using npm
npm install dirliner
```

## Quick Start

### CLI Quick Start
```bash
# Basic usage
dirliner -s ./src -t ./dist

# With ignore patterns
dirliner -s ./src -t ./dist -i "node_modules,*.log"
```

### TypeScript Quick Start
```typescript
const { DirLiner } = require('dirliner');

const liner = new DirLiner({
    source: './src',
    target: './dist'
});

const result = liner.execute();
```

## CLI Usage

### Command Line Options

```bash
dirliner [options]

Options:
  -V, --version            output the version number
  -s, --source <dir>       Source directory (default: "./")
  -t, --target <dir>       Target directory (default: "./output")
  -v, --verbose            Show verbose output
  -i, --ignore <patterns>  Ignore patterns (comma-separated)
  --ignore-file <file>     File containing ignore patterns (default: ".dirlinerignore")
  -h, --help              display help information
```

## TypeScript API

### Basic Usage
```typescript
const { DirLiner } = require('dirliner');

const liner = new DirLiner({
    source: './src',
    target: './dist'
});

const result = liner.execute();
```

### Advanced Usage
```typescript
const { DirLiner } = require('dirliner');

const options = {
    source: './src',
    target: './dist',
    ignorePatterns: ['node_modules', '*.log'],
    ignoreFile: '.customignore',
    verbose: true
};

const liner = new DirLiner(options);
const result = liner.execute();

if (result.success) {
    console.log(`Processed files: ${result.processed.length}`);
    result.processed.forEach(file => {
        console.log(`${file.source} -> ${file.target}`);
    });
} else {
    console.error(`Error: ${result.error}`);
}
```

## Configuration

### Options Object

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| source | string | './' | Source directory path |
| target | string | './output' | Target directory path |
| ignorePatterns | string[] | [] | Array of patterns to ignore |
| ignoreFile | string | '.dirlinerignore' | Path to ignore file |
| verbose | boolean | false | Enable verbose logging |

## Ignore Patterns

### Supported Pattern Types

- **Exact matches**: Match specific files or directories
  ```
  node_modules
  temp.txt
  ```

- **Wildcards**: Use * for matching multiple characters
  ```
  *.log
  *.tmp
  ```

- **Directory patterns**: Match entire directories
  ```
  temp/*
  build/**/*
  ```

- **Negation**: Include previously excluded files
  ```
  !important.log
  !src/config/*
  ```

### Ignore File Format

Create a `.dirlinerignore` file (or custom name) with one pattern per line:
```
# This is a comment
node_modules
*.log
temp/*
!important.log
```

## Development

### Setup Development Environment
```bash
# Clone the repository
git clone https://github.com/anbturki/dirliner.git

# Install dependencies
yarn install

# Build the project
yarn build

# Run tests
yarn test

# Run linting
yarn lint
```

## Troubleshooting

### Common Issues

1. **Ignore Patterns Not Working**
   - Ensure patterns follow the glob syntax
   - Check file paths are relative to source directory
   - Verify ignore file exists and is readable

2. **Files Not Copying**
   - Check source directory exists
   - Verify target directory is writable
   - Ensure files aren't being ignored

3. **Permission Issues**
   - If getting permission denied, run:
     ```bash
     chmod +x $(which dirliner)
     ```
   - Or reinstall globally with:
     ```bash
     yarn global add dirliner --prefix /usr/local
     ```

### Error Messages

| Error | Solution |
|-------|----------|
| ENOENT: no such file or directory | Verify the source path exists |
| EACCES: permission denied | Check file/directory permissions |
| EEXIST: file already exists | Use a different target directory |
| TS2307: Cannot find module | Ensure proper CommonJS require |

For more help, please [open an issue](https://github.com/anbturki/dirliner/issues).

## License

MIT © Ali Turki