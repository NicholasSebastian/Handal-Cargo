# Handal Cargo

With 6953 lines of code!

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
- Might need to allow for the Sea Freight and Air Cargo marking fields to be editable.

## QUESTIONABLE THINGS THAT NEED TO BE ASKED

- How to calculate the 'Margins' and 'Biaya' in the 'Laporan Rugi Laba'?

## POSSIBLE FUTURE FEATURES

- Table pagination and fixed header.
- Sort tables by specified column.
