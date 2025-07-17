# express-pure-sanitize

An Express.js middleware and utility for automatic sanitization of request data. Protect your API from XSS, SQL injection, unwanted HTML, emojis, and more with flexible configuration.

## Features

- Remove HTML tags
- Block script keywords
- Remove emojis and unicode control characters
- Escape quotes
- Lowercase emails and normalize fields
- Strip SQL meta characters
- Limit string length
- Collapse whitespace
- Allow only specific characters
- Ignore or sanitize only specific fields
- Recursively sanitize arrays and objects

## Installation

```bash
npm install auto-sanitize
```

## Usage

```js
const express = require("express");
const { autoSanitize } = require("auto-sanitize");
const app = express();

app.use(express.json());
app.use(
  autoSanitize({
    trimStrings: true,
    removeHTML: true,
    blockScriptKeywords: true,
    removeEmojis: true,
    escapeQuotes: true,
    lowercaseEmails: true,
    allowedChars: /[a-zA-Z0-9@. ]/,
    normalizeFields: ["username", "email"],
    maxStringLength: 100,
    // ...other options
  })
);

app.post("/data", (req, res) => {
  // req.body, req.query, req.params are sanitized
  res.json(req.body);
});
```

## API

### Middleware: `autoSanitize(options)`

Sanitizes `req.body`, `req.query`, and `req.params` automatically.

### Utility: `sanitizeString(value, options, key)`

Sanitizes a single string value.

### Utility: `cleanObject(object, options)`

Recursively sanitizes an object or array.

## Options

See `src/types.ts` for all available options and their descriptions.

## License

MIT
