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
- [Use Cases](#use-cases)
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

## Use Cases

### Development and Code Review

#### 1. Code Review Preparation
Perfect for preparing code for review platforms that don't accept directory structures:
```bash
# Basic code review preparation
dirliner -s ./project -t ./review -i "node_modules,dist,*.test.js,coverage"

# For pull request reviews
dirliner -s ./changed-files -t ./pr-review -i "*.test.js,*.spec.js,__snapshots__"

# Preparing frontend code only
dirliner -s ./src/frontend -t ./review/frontend -i "*.test.*,*.css,*.scss,assets"
```

#### 2. Monorepo Management
Handle multiple packages in monorepos effectively:
```bash
# Process all packages
dirliner -s ./packages -t ./dist -i "node_modules,test,*.test.ts"

# Process specific package
dirliner -s ./packages/core -t ./dist/core -i "node_modules,test"

# Prepare for dependency analysis
dirliner -s ./packages -t ./deps-analysis -i "!package.json,node_modules,*.log"
```

#### 3. Legacy Code Migration
Flatten and analyze complex legacy systems:
```bash
# Basic legacy system processing
dirliner -s ./legacy-system -t ./analysis -i "*.dll,*.exe,temp"

# Extract specific components
dirliner -s ./legacy/src -t ./migration/phase1 -i "!*.java,!*.xml,*.class"

# Prepare for modernization
dirliner -s ./old-codebase -t ./modern-prep -i "*.bak,*.old,temp"
```

### AI and Machine Learning

#### 4. AI Model Training Data
Prepare source code for AI model training:
```bash
# Process code for training
dirliner -s ./training-data -t ./processed -i "*.jpg,*.png,node_modules,*.pyc"

# Prepare multilingual dataset
dirliner -s ./code-samples -t ./training \
  -i "!*.{py,js,java,cpp},node_modules" --ignore-file .mlignore

# Extract specific patterns
dirliner -s ./samples -t ./patterns \
  -i "!**/pattern*.{js,py},node_modules"
```

#### 5. Code Analysis Projects
Prepare code for various analysis tools:
```bash
# Static analysis preparation
dirliner -s ./src -t ./analysis -i "!*.{js,ts},node_modules"

# Security audit preparation
dirliner -s ./project -t ./security-audit \
  -i "!*.{js,php,py},node_modules,*.test.*"

# Performance analysis setup
dirliner -s ./app -t ./perf-analysis \
  -i "*.test.*,*.spec.*,mock*"
```

### Documentation and Learning

#### 6. Documentation Generation
Prepare source files for documentation systems:
```bash
# API documentation preparation
dirliner -s ./src -t ./docs-source -i "!*.ts,!*.tsx,node_modules"

# Tutorial content preparation
dirliner -s ./examples -t ./tutorial-files \
  -i "advanced/**,test/**,*.test.*"

# Technical documentation
dirliner -s ./tech-docs -t ./processed-docs \
  -i "!*.md,!*.mdx,drafts,*.pdf"
```

#### 7. Teaching and Learning
Create simplified versions for educational purposes:
```bash
# Basic tutorial setup
dirliner -s ./tutorial -t ./lesson -i "advanced,*.test.js,*.md"

# Workshop materials
dirliner -s ./workshop -t ./exercises \
  -i "solutions,complete,*.solution.*"

# Student project templates
dirliner -s ./template -t ./student-template \
  -i "advanced/**,tests/**,docs/**"
```

### DevOps and Deployment

#### 8. Continuous Integration
Prepare code for CI/CD pipelines:
```bash
# CI environment setup
dirliner -s ./src -t ./ci-ready -i "test,*.test.js,coverage"

# Deployment package preparation
dirliner -s ./dist -t ./deploy-pkg \
  -i "*.map,*.test.*,mock*"

# Integration testing setup
dirliner -s ./integration -t ./test-env \
  -i "unit/**,*.unit.*,fixtures"
```

#### 9. Backup and Archiving
Create organized backups of projects:
```bash
# Daily backup
dirliner -s ./project -t ./backup-$(date +%Y%m%d) \
  -i "node_modules,*.log,temp"

# Version archive
dirliner -s ./releases -t ./archive \
  -i "*.tmp,*.bak,temp"

# Source code backup
dirliner -s ./src -t ./src-backup \
  -i "node_modules,dist,*.log"
```

### Security and Compliance

#### 10. Security Review
Prepare code for security audits:
```bash
# Security audit preparation
dirliner -s ./project -t ./security-review \
  -i "*.test.*,*.spec.*,mocks"

# Compliance check setup
dirliner -s ./sensitive -t ./audit \
  -i "*.key,*.pem,*.env"
```

#### 11. Code Sharing
Prepare code for sharing while maintaining privacy:
```bash
# Remove sensitive data
dirliner -s ./project -t ./shareable \
  -i "config/*.json,*.env,secrets"

# Create public version
dirliner -s ./src -t ./public-source \
  -i "internal/**,private/**,*.secret.*"
```

#### 12. License Compliance
Prepare code for license analysis:
```bash
# License check preparation
dirliner -s ./project -t ./license-check \
  -i "!package.json,!LICENSE*,node_modules"

# Third-party code analysis
dirliner -s ./vendor -t ./third-party \
  -i "!LICENSE*,!NOTICE*,*.test.*"
```

### Advanced Use Cases

#### 13. Microservices Development
Handle microservice architectures:
```bash
# Service isolation
dirliner -s ./services -t ./isolated \
  -i "node_modules,*.test.*" --ignore-file .serviceignore

# API gateway setup
dirliner -s ./gateway -t ./gateway-deploy \
  -i "test/**,mock/**,*.test.*"
```

#### 14. Component Libraries
Manage component library development:
```bash
# Component extraction
dirliner -s ./components -t ./lib \
  -i "*.test.*,*.story.*,*.spec.*"

# Style processing
dirliner -s ./styles -t ./processed-styles \
  -i "*.test.*,*.map,temp"
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

## Examples

### Basic CLI Examples

1. Process a simple project directory:
```bash
dirliner -s ./my-project -t ./flat-files
```

2. Enable verbose logging to see detailed operations:
```bash
dirliner -s ./src -t ./output -v
```

3. Use custom ignore patterns:
```bash
dirliner -s ./project -t ./dest -i "*.test.js,*.spec.ts,coverage"
```

### Advanced CLI Usage

1. Process multiple ignore patterns with a custom ignore file:
```bash
# First, create a .customignore file:
# node_modules
# *.test.js
# coverage/
# .git/
# *.log

dirliner -s ./project -t ./output --ignore-file .customignore
```

2. Process specific subdirectories while ignoring others:
```bash
dirliner -s ./monorepo/packages -t ./flat -i "node_modules,dist,*.test.ts"
```

3. Process TypeScript project while keeping only source files:
```bash
dirliner -s ./typescript-project -t ./review-ready -i "node_modules,dist,coverage,*.js,*.d.ts,*.map"
```

### Real-World Scenarios

1. Prepare a React project for code review:
```bash
# Flatten only the src directory while ignoring tests and build files
dirliner -s ./react-app/src -t ./review \
  -i "*.test.tsx,*.test.ts,__tests__,__mocks__,*.css,*.scss"
```

2. Process a Node.js backend for documentation:
```bash
# Keep only the core source files
dirliner -s ./backend -t ./docs-source \
  -i "node_modules,test,*.test.js,*.spec.js,coverage,dist,build"
```

3. Prepare multiple projects for AI analysis:
```bash
# Process multiple projects into a single directory
dirliner -s ./project1 -t ./ai-ready/project1 -i "node_modules,dist"
dirliner -s ./project2 -t ./ai-ready/project2 -i "node_modules,dist"
```

### Working with Different File Types

1. Process only TypeScript files:
```bash
dirliner -s ./src -t ./ts-only \
  -i "!*.ts,!*.tsx,node_modules"  # Notice the ! to include only TypeScript files
```

2. Separate configuration files:
```bash
dirliner -s ./config -t ./flat-config \
  -i "!*.json,!*.yaml,!*.env"
```

3. Process documentation files:
```bash
dirliner -s ./docs -t ./flat-docs \
  -i "!*.md,!*.mdx,node_modules,*.jpg,*.png"
```

### Tips for CLI Usage

1. Use quotes for patterns with special characters:
```bash
dirliner -s ./src -t ./output -i "*.{js,ts},**/*.test.*"
```

2. Combine multiple ignore patterns:
```bash
dirliner -s ./project -t ./output -i "node_modules,*.log,**/*.test.*,dist/**/*"
```

3. Use relative paths effectively:
```bash
dirliner -s ../parent-project/src -t ./processed-files
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