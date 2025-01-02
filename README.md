# JavaScript WebContainer Playground

Browser-based JavaScript playground using WebContainer API.

## Features
- Browser JavaScript execution
- Isolated runtime
- Dark theme editor
- Real-time output

## Quick Start
```bash
# Create project
npm create vite@latest webcontainers -- --template react

# Setup
cd webcontainers
npm install

# Start dev server
npm run dev
```

## Dependencies
```bash
# Core
npm install @webcontainer/api

# Styling
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

## Project Structure
```
webcontainers/
├── src/
│   ├── App.jsx    # Main component
│   ├── main.jsx   # Entry point
│   └── index.css  # Styles
├── vite.config.js
├── tailwind.config.js
└── package.json
```

## Configuration
Add to `vite.config.js`:
```js
server: {
  headers: {
    'Cross-Origin-Embedder-Policy': 'require-corp',
    'Cross-Origin-Opener-Policy': 'same-origin',
  },
}
```

## Error Handling
```js
try {
  // WebContainer code
} catch (error) {
  console.error('Runtime error:', error)
  setOutput('Error: ' + error.message)
}
```

## Browser Support
- Chrome
- Edge
- Firefox
(Requires WebAssembly)

## Limitations
- JavaScript/Node.js only
- No file persistence
- No external packages
