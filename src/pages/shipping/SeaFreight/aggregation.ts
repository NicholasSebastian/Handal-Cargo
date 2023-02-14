interface ILookup {
  from: string
  localField: string
  foreignField: string
  as: string
}

export const aggregationLookup: Array<ILookup> = [
  {
    from: 'TravelPermits',
    localField: 'markings.marking',
    foreignField: 'marking',
    as: 'travel_permits'
  },
  {
    from: 'Invoices',
    localField: 'markings.marking',
    foreignField: 'marking',
    as: 'invoices'
  },
  {
    from: 'Payments',
    localField: 'invoices.payment',
    foreignField: '_id',
    as: 'payments'
  }
];

export const markingAggregation = {
  $map: {
    input: "$markings",
    as: "marking",
    in: {
      $mergeObjects: [
        "$$marking",
        { 
          paid: { // TODO: Whatever the fuck this is.
            $gt: [
              { $sum: "$payments.items.amount" }, 
              { $sum: "$invoices.price" }
            ] 
          },
          remainder: {
            $subtract: [
              "$$marking.quantity", 
              { $sum: "$travel_permits.quantity" } // TODO: Sum of travel_permits.quantity that match the current marking.
            ] 
          }, 
          travel_documents: {
            $size: {
              $filter: {
                input: "$travel_permits",
                as: "travel_permit",
                cond: { $eq: ["$$travel_permit.marking", "$$marking.marking"] }
              }
            }
          }, 
          invoices: {
            $size: {
              $filter: {
                input: "$invoices",
                as: "invoice",
                cond: { $eq: ["$$invoice.marking", "$$marking.marking"] }
              }
            }
          }
        }
      ]
    }
  }
};
