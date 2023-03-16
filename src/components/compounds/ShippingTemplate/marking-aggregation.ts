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

const markingTravelPermits = {
  $filter: {
    input: "$travel_permits",
    cond: { $eq: ["$$this.marking_id", "$$marking.marking_id"] }
  }
};

const markingInvoices = {
  $filter: {
    input: "$invoices",
    cond: { $eq: ['$$this.marking_id', '$$marking.marking_id'] }
  }
};

const markingPayments = {
  $filter: {
    input: "$payments",
    cond: {
      $in: [
        "$$this._id",
        {
          $map: {
            input: markingInvoices,
            in: "$$this.payment"
          }
        }
      ]
    }
  }
};

const markingTravelPermitsQuantityTotal = { 
  $sum: { 
    $map: { 
      input: markingTravelPermits, 
      in: "$$this.quantity" 
    } 
  } 
};

const markingInvoicesTotal = {
  $sum: {
    $map: {
      input: markingInvoices,
      in: "$$this.total"
    }
  }
};

const markingPaymentsTotal = {
  $sum: {
    $map: {
      input: markingPayments,
      in: { $sum: "$$this.items.amount" }
    }
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
            $and: [
              {$gte: [markingPaymentsTotal, markingInvoicesTotal]},
              {$gt: [markingInvoicesTotal, 0]}
            ]
          },
          remainder: {
            $subtract: ["$$marking.quantity", markingTravelPermitsQuantityTotal] 
          }, 
          travel_documents: { 
            $size: markingTravelPermits 
          }, 
          invoices: { 
            $size: markingInvoices 
          }
        }
      ]
    }
  }
};
