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

const travelPermits = {
  $filter: {
    input: "$travel_permits",
    as: "travel_permit",
    cond: { $eq: ["$$travel_permit.marking_id", "$$marking.marking_id"] }
  }
};

const invoices = {
  $filter: {
    input: "$invoices",
    as: "invoice",
    cond: { $eq: ["$$invoice.marking_id", "$$marking.marking_id"] }
  }
};

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
              { $sum: { $first: "$payments.items.amount" } },
              { $sum: { $map: { input: invoices, as: "invoice", in: "$$invoice.total" } } }
            ] 
          },
          remainder: {
            $subtract: [
              "$$marking.quantity",
              { $sum: { $map: { input: travelPermits, as: "travel_permit", in: "$$travel_permit.quantity" } } }
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
