# Handal Cargo

## NOTES

If getting errors saying that the module 'crypto' cannot be found, add the following snippet:

```json
fallback: {
  "crypto": false
}
```

to your "node_modules/react-scripts/config/webpack.config.js" > "exports" > "resolve".

<https://www.mongodb.com/community/forums/t/cant-resolve-crypto-in-node-modules-bson-dist-react/143227>

## TO DO LIST

- Staff Profiles
  - Access Levels
  - Staff Groups
- Company Setup
- References
  - ListTemplate
- Shipping
  - TableTemplate
  - MarkingTemplate
    - Sisa
  - SeaFreight
  - AirCargo
  - Customers
  - Invoice Entry
  - Payments
- Shortcuts
- Printing
  - Surat Jalan
  - Faktur
- Reports
- Other small shit
  - Advanced Search
  - Autocomplete on Search
  - Limit table height, add pagination
  - Show MongoDB monthly usage.
