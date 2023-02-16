interface ILookup {
  from: string
  localField: string
  foreignField: string
  as: string
}

const travelPermits = {
  $filter: {
    input: "$travel_permits",
    as: "travel_permit",
    cond: { $eq: ["$$travel_permit.marking", "$$marking.marking"] }
  }
};

const invoices = {
  $filter: {
    input: "$invoices",
    as: "invoice",
    cond: { $eq: ["$$invoice.marking", "$$marking.marking"] }
  }
};

const travelPermitQuantities = {
  $map: {
    input: travelPermits,
    as: "travel_permit",
    in: "$$travel_permit.quantity"
  }
};

const invoicePrices = {
  $map: {
    input: invoices,
    as: "invoice",
    in: "$$invoice.total"
  }
}

export const markingAggregation = {
  $map: {
    input: "$markings",
    as: "marking",
    in: {
      $mergeObjects: [
        "$$marking",
        { 
          paid: {
            $gt: [
              { $sum: "$payments.items.amount" }, // TODO: Whatever the fuck this is.
              { $sum: invoicePrices }
            ] 
          },
          remainder: {
            $subtract: [
              "$$marking.quantity",
              { $sum: travelPermitQuantities }
            ] 
          }, 
          travel_documents: { 
            $size: travelPermits 
          }, 
          invoices: { 
            $size: invoices 
          }
        }
      ]
    }
  }
};

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
    localField: 'invoices.payment', // TODO: Maybe fix this one too.
    foreignField: '_id',
    as: 'payments'
  }
];
