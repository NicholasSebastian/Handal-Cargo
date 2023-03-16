
// This looks absolutely retarded.
const commonFields = {
  _id: '$_id',
  payment: '$payment_amount.id',
  marking: '$marking',
  quantity: '$quantity',
  measurement_option: '$measurement_option',
  measurement: '$measurement',
  exchange_rate: '$exchange_rate',
  price: '$price',
  volume_charge: '$volume_charge',
  additional_fee: '$additional_fee',
  shipment_fee: '$shipment_fee',
  total: '$total',
  description: '$description',
  payment_amount: {
    $sum: {
      $first: '$payment_amount.items.amount'
    }
  }
}

const pipeline = [
  { 
    $lookup: { 
      from: 'SeaFreight', 
      localField: 'marking_id', 
      foreignField: 'markings.marking_id', 
      as: 'seafreight' 
    } 
  },
  { 
    $lookup: { 
      from: 'AirCargo', 
      localField: 'marking_id', 
      foreignField: 'markings.marking_id', 
      as: 'aircargo' 
    } 
  },
  {
    $lookup: {
      from: 'Payments',
      localField: 'payment',
      foreignField: '_id',
      as: 'payment_amount'
    }
  },
  { 
    $project: { 
      seafreight: { 
        $cond: { 
          if: { $gt: [{ $size: '$seafreight' }, 0] }, 
          else: '$$REMOVE', 
          then: {
            ...commonFields,
            muat_date: { $first: '$seafreight.muat_date' },
            arrival_date: { $first: '$seafreight.arrival_date' },
            container_number: { $first: '$seafreight.container_number' }
          }
        } 
      },
      aircargo: { 
        $cond: { 
          if: { $gt: [{ $size: '$aircargo' }, 0] }, 
          else: '$$REMOVE', 
          then: {
            ...commonFields,
            muat_date: { $first: '$aircargo.muat_date' },
            arrival_date: { $first: '$aircargo.arrival_date' },
            airwaybill_number: { $first: '$aircargo.airwaybill_number' },
            item_code: { $first: '$aircargo.item_code' }
          } 
        } 
      }
    }
  },
  {
    $replaceRoot: {
      newRoot: {
        $mergeObjects: ['$aircargo', '$seafreight']
      }
    }
  }
];

export default pipeline;
