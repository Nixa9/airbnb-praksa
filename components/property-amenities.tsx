import { WifiIcon, TvIcon, CarIcon } from "lucide-react"

export function PropertyAmenities() {
  return (
    <div className="mt-8">
      <h2 className="text-2xl font-semibold mb-4">Amenities</h2>
      <ul className="grid grid-cols-2 gap-4">
        <li className="flex items-center">
          <WifiIcon className="h-5 w-5 mr-2" />
          Wifi
        </li>
        <li className="flex items-center">
          <TvIcon className="h-5 w-5 mr-2" />
          TV
        </li>
        <li className="flex items-center">
          <CarIcon className="h-5 w-5 mr-2" />
          Free parking
        </li>
      </ul>
    </div>
  )
}
