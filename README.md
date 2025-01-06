# dirliner

[![npm version](https://badge.fury.io/js/dirliner.svg)](https://badge.fury.io/js/dirliner)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](http://www.typescriptlang.org/)

A TypeScript library and CLI tool for transforming directory structures into flat files while preserving path relationships in filenames. Convert paths like `src/app/page.ts` to `src-app-page.ts` automatically.

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
- [AI Tool Integration](#ai-tool-integration)
- [Examples](#examples)
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

### Types and Interfaces

```typescript
interface DirLinerOptions {
    source?: string;
    target?: string;
    ignorePatterns?: string[];
    ignoreFile?: string;
    verbose?: boolean;
}

interface ProcessedFile {
    source: string;
    target: string;
}

interface DirLinerResult {
    success: boolean;
    processed: ProcessedFile[];
    error: string | null;
}
```

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

## AI Tool Integration

Many AI tools and code review platforms don't accept directory uploads, requiring all code to be in individual files. Dirliner makes it easy to prepare your code for these platforms while maintaining clear file relationships.

### Example: Preparing Code for AI Review
```typescript
const { DirLiner } = require('dirliner');

const liner = new DirLiner({
    source: './my-project',
    target: './ai-upload',
    ignorePatterns: [
        'node_modules',
        '.git',
        'dist',
        '*.log',
        '*.lock'
    ],
    verbose: true
});

const result = liner.execute();
```

This will transform your project structure from:
```
my-project/
├── src/
│   ├── components/
│   │   ├── Button.tsx
│   │   └── Header.tsx
│   └── pages/
│       ├── index.tsx
│       └── about.tsx
└── package.json
```

To:
```
ai-upload/
├── src-components-Button.tsx
├── src-components-Header.tsx
├── src-pages-index.tsx
├── src-pages-about.tsx
└── package.json
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

### Project Structure
```
dirliner/
├── src/
│   ├── index.ts           # Main library entry point
│   ├── cli.ts            # CLI entry point
│   └── utils/
│       ├── ignore.ts     # Ignore pattern handling
│       └── transform.ts  # Filename transformation
├── bin/
│   └── dirliner.ts      # CLI executable
├── dist/                # Compiled JavaScript files
├── test/
│   └── index.test.ts    # Tests
├── tsconfig.json        # TypeScript configuration
├── jest.config.js       # Jest configuration
└── package.json
```

## Troubleshooting

### Common Issues

1. **Ignore Patterns Not Working**
   - Ensure patterns follow the glob syntax
   - Check file paths are relative to source directory
   - Verify ignore file exists and is readable

3. **Files Not Copying**
   - Check source directory exists
   - Verify target directory is writable
   - Ensure files aren't being ignored

4. **Permission Issues**
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