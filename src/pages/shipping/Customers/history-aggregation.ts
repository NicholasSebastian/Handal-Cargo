import { BSON } from "realm-web";

const seafreightFields = {
  muat_date: 1, 
  arrival_date: 1, 
  container_number: 1
};

const seafreightLookup = {
  $lookup: {
    from: 'SeaFreight',
    let: { marking: '$markings' },
    pipeline: [
      { $match: { $expr: { $in: ['$$marking', '$markings.marking'] } } },
      { $project: { 
        _id: 0,
        ...seafreightFields, 
        markings: {
          $filter: {
            input: '$markings',
            cond: {
              $eq: ['$$this.marking', '$$marking']
            }
          }
        }
      }},
      { $project: {
        ...seafreightFields, 
        marking_id: { $first: '$markings.marking_id' },
        quantity: { $first: '$markings.quantity' }
      }}
    ],
    as: 'seafreight'
  }
};

const aircargoFields = {
  muat_date: 1, 
  arrival_date: 1, 
  airwaybill_number: 1,
  item_code: 1
}

const aircargoLookup = {
  $lookup: {
    from: 'AirCargo',
    let: { marking: '$markings' },
    pipeline: [
      { $match: { $expr: { $in: ['$$marking', '$markings.marking'] } } },
      { $project: { 
        _id: 0,
        ...aircargoFields,
        markings: {
          $filter: {
            input: '$markings',
            cond: {
              $eq: ['$$this.marking', '$$marking']
            }
          }
        }
      }},
      { $project: {
        ...aircargoFields,
        marking_id: { $first: '$markings.marking_id' },
        quantity: { $first: '$markings.quantity' }
      }}
    ],
    as: 'aircargo'
  }
};

const invoiceLookup = {
  $lookup: {
    from: 'Invoices',
    let: { id: '$entries.marking_id' },
    pipeline: [
      { $match: { $expr: { $eq: ['$marking_id', '$$id'] } } },
      { $project: { 
        _id: 0,
        measurement_option: 1,
        measurement: 1, 
        exchange_rate: 1,
        price: 1,
        volume_charge: 1,
        shipment_fee: 1,
        additional_fee: 1,
        other_fee: 1,
        discount: 1,
        total: 1,
        description: 1,
        payment_id: '$payment'
      }}
    ],
    as: 'invoice'
  }
}

const removeUninvolvedDocuments = { 
  $match: {  
    $expr: {
      $or: [
        { $gt: [{ $size: '$seafreight' }, 0] },
        { $gt: [{ $size: '$aircargo' }, 0] }
      ]
    }
  } 
};

const mergeShippingEntries = {
  $project: {
    _id: 0,
    marking: '$markings',
    entries: {
      $concatArrays: ['$seafreight', '$aircargo']
    }
  }
};

const prettify = {
  $replaceRoot: {
    newRoot: {
      $mergeObjects: [
        { marking: '$marking' },
        '$entries',
        { $first: '$invoice' }
      ]
    }
  }
};

// 9 layers of aggregation bless my soul.

const pipeline = (id: BSON.ObjectId) => [
  { $match: { _id: id } },
  { $unwind: { path: '$markings', preserveNullAndEmptyArrays: true } },
  seafreightLookup,
  aircargoLookup,
  removeUninvolvedDocuments,
  mergeShippingEntries,
  { $unwind: { path: '$entries', preserveNullAndEmptyArrays: true } },
  invoiceLookup,
  prettify
];

export default pipeline;
