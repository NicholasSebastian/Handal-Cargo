# NOTES

If getting errors saying that the module 'crypto' cannot be found, add the following snippet:

```
fallback: {
  crypto: false
}
```

to your "node_modules/react-scripts/config/webpack.config.js" > "exports" > "resolve".
