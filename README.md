# Handal Cargo

With 7191 lines of code!

## NOTES FOR MYSELF

If you're getting errors saying that the module 'crypto' cannot be found, add the following snippet:

```json
fallback: {
  "crypto": false
}
```

to your "node_modules/react-scripts/config/webpack.config.js" > "exports" > "resolve".

<https://www.mongodb.com/community/forums/t/cant-resolve-crypto-in-node-modules-bson-dist-react/143227>

## TO DO LIST

- Printing adjustments:
  - The printing positions.
  - Text that is too long needs to get truncated.

## POSSIBLE FUTURE FEATURES

- Table pagination and fixed header.
- Sort tables by specified column.
