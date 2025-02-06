interface PriceSummaryProps {
  pricePerNight: number
  numberOfNights: number
  total: number
}

export function PriceSummary({ pricePerNight, numberOfNights, total }: PriceSummaryProps) {
  return (
    <div className="w-full">
      <div className="flex justify-between items-center">
        <span>${pricePerNight} × {numberOfNights} nights</span>
        <span>${total}</span>
      </div>
      <div className="border-t mt-2 pt-2">
        <div className="flex justify-between items-center font-bold">
          <span>Total</span>
          <span>${total}</span>
        </div>
      </div>
    </div>
  )
}
