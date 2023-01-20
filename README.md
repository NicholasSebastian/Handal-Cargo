# Handal Cargo

## NOTES

If you're getting errors saying that the module 'crypto' cannot be found, add the following snippet:

```json
fallback: {
  "crypto": false
}
```

to your "node_modules/react-scripts/config/webpack.config.js" > "exports" > "resolve".

<https://www.mongodb.com/community/forums/t/cant-resolve-crypto-in-node-modules-bson-dist-react/143227>

## TO DO LIST

- Company Setup
- Shipping
  - MarkingTemplate
    - Sisa
  - SeaFreight
  - AirCargo
  - Customers
  - Invoice Entry
  - Payments
- Printing
  - Surat Jalan
  - Faktur
- Reports
- Other small shit
  - Limit table height; pagination.
  - Sort tables by specified column.
  - Dashboard to show MongoDB monthly usage.
