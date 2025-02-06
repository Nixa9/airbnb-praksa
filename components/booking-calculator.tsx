"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPinIcon, BedDoubleIcon, BathIcon, UsersIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { DatePicker } from "./date-picker"
import { PriceSummary } from "./price-summary"
import { createBooking, getBookedDates } from "@/lib/services/bookings"

interface BookingCalculatorProps {
  propertyId: string
  price: number
  maxGuests: number
  bedrooms: number
  bathrooms: number
  location: string
}

export default function BookingCalculator({ propertyId, price, maxGuests, bedrooms, bathrooms, location }: BookingCalculatorProps) {
  const router = useRouter()
  const [checkIn, setCheckIn] = useState<Date | undefined>()
  const [checkOut, setCheckOut] = useState<Date | undefined>()
  const [guests, setGuests] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [bookedDates, setBookedDates] = useState<Date[]>([])
  const [totalPrice, setTotalPrice] = useState<number | null>(null)

  useEffect(() => {
    if (checkIn && checkOut) {
      const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24))
      setTotalPrice(nights * price)
    } else {
      setTotalPrice(null)
    }
  }, [checkIn, checkOut, price])

  useEffect(() => {
    getBookedDates(propertyId)
      .then(setBookedDates)
      .catch(error => console.error('Error fetching booked dates:', error))
  }, [propertyId])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">${price} / night</CardTitle>
        <CardDescription>
          <div className="flex items-center">
            <MapPinIcon className="h-4 w-4 mr-1" />
            <span>{location}</span>
          </div>
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-4 text-neutral-700 dark:text-neutral-300 mb-4">
          <div className="flex items-center w-full sm:w-auto">
            <BedDoubleIcon className="h-5 w-5 mr-2" />
            <span>{bedrooms}&nbsp;</span>
            <span>Bedrooms</span>
          </div>
          <div className="flex items-center w-full sm:w-auto">
            <BathIcon className="h-5 w-5 mr-2" />
            <span>{bathrooms}&nbsp;</span>
            <span>Bathrooms</span>
          </div>
          <div className="flex items-center w-full sm:w-auto">
            <UsersIcon className="h-5 w-5 mr-2" />
            <span>{maxGuests}&nbsp;</span>
            <span>Guests</span>
          </div>
        </div>

        <form>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-4 mb-4">
            <div className="w-full">
              <DatePicker
                date={checkIn}
                onSelect={setCheckIn}
                label="Pick a check-in date"
                disabledDates={bookedDates}
              />
            </div>
            <div className="w-full">
              <DatePicker
                date={checkOut}
                onSelect={setCheckOut}
                label="Pick a check-out date"
                disabledDates={bookedDates}
                minDate={checkIn}
              />
            </div>
          </div>


          <div className="mb-4">
            <label htmlFor="guests" className="block text-sm font-medium mb-1">
              Guests
            </label>
            <select
              id="guests"
              name="guests"
              className="w-full p-2 border rounded"
              value={guests}
              onChange={(e) => setGuests(Number(e.target.value))}
            >
              {[...Array(maxGuests)].map((_, i) => (
                <option key={i} value={i + 1}>
                  {i + 1} guest{i !== 0 ? "s" : ""}
                </option>
              ))}
            </select>
          </div>
        </form>
      </CardContent>

      <CardFooter className="flex flex-col gap-4">
        {totalPrice !== null && (
          <PriceSummary
            pricePerNight={price}
            numberOfNights={Math.ceil((checkOut!.getTime() - checkIn!.getTime()) / (1000 * 60 * 60 * 24))}
            total={totalPrice}
          />
        )}

        <Button
          className="w-full"
          disabled={!checkIn || !checkOut || isLoading}
          onClick={async () => {
            if (!checkIn || !checkOut || !totalPrice) {
              toast.error("Please select dates to make a booking")
              return
            }

            setIsLoading(true)
            try {
              await createBooking({
                propertyId,
                checkIn,
                checkOut,
                guests,
                totalPrice
              })
              toast.success("Booking confirmed!")
              router.push("/bookings")
            } catch (error) {
              if (error instanceof Error) {
                if (error.message === "User not authenticated") {
                  toast.error("Please log in to make a booking")
                } else {
                  toast.error("Failed to create booking. Please try again.")
                }
              }
              console.error("Booking error:", error)
            } finally {
              setIsLoading(false)
            }
          }}
        >
          {isLoading ? "Booking..." : "Book Now"}
        </Button>
      </CardFooter>
    </Card>
  )
}
