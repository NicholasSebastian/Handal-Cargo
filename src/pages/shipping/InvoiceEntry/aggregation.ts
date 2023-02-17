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
      payment: 1,
      marking: 1,
      quantity: 1,
      measurement_option: 1,
      measurement: 1,
      exchange_rate: 1,
      price: 1,
      volume_charge: 1,
      additional_fee: 1,
      shipment_fee: 1,
      total: 1,
      seafreight: { 
        $cond: { 
          if: { $gt: [{ $size: '$seafreight' }, 0] }, 
          else: '$$REMOVE', 
          then: {
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
            muat_date: { $first: '$aircargo.muat_date' },
            arrival_date: { $first: '$aircargo.arrival_date' },
            airwaybill_number: { $first: '$aircargo.airwaybill_number' },
            item_code: { $first: '$aircargo.item_code' }
          } 
        } 
      },
      payment_amount: {
        $sum: {
          $first: '$payment_amount.items.amount'
        }
      }
    }
  }
];

// I tried using '$replaceRoot' but it wouldn't work in this version of realm-web :(
// So we'll use this sad function to do it manually :)

function manuallyReplaceRoot(results: Array<Record<string, any>>) {
  return results.map(result => {
    if ('seafreight' in result) {
      const data = { ...result, ...result.seafreight };
      delete data.seafreight;
      return data;
    }
    else if ('aircargo' in result) {
      const data = { ...result, ...result.aircargo };
      delete result.aircargo;
      return data;
    }
  })
}

export { manuallyReplaceRoot };
export default pipeline;
