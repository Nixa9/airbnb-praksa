"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CalendarIcon, MapPinIcon, UsersIcon } from "lucide-react"
import { format } from "date-fns"
import { BookingWithProperty, cancelBooking } from "@/lib/services/bookings"
import { useState } from "react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface BookingCardProps {
  booking: BookingWithProperty
}

export function BookingCard({ booking }: BookingCardProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleCancel = async () => {
    if (!confirm("Are you sure you want to cancel this booking?")) return

    setIsLoading(true)
    try {
      await cancelBooking(booking.id)
      toast.success("Booking cancelled successfully")
      router.refresh()
    } catch (error) {
      toast.error("Failed to cancel booking")
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card key={booking.id} className="overflow-hidden">
      <div className="flex flex-col md:flex-row">
        <div className="flex-1 p-6">
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-2">{booking.properties.title}</h2>
            <div className="flex items-center text-muted-foreground">
              <MapPinIcon className="h-4 w-4 mr-1" />
              {booking.properties.location}
            </div>
            <p className="text-muted-foreground mt-2 line-clamp-2">{booking.properties.description}</p>
          </div>
          <div className="space-y-4">
            <div className="flex items-center text-sm">
              <CalendarIcon className="h-4 w-4 mr-2" />
              <span>
                {format(new Date(booking.check_in), "MMM d, yyyy")}
                {" → "}
                {format(new Date(booking.check_out), "MMM d, yyyy")}
              </span>
            </div>
            <div className="flex items-center text-sm">
              <UsersIcon className="h-4 w-4 mr-2" />
              {booking.guests} guest{booking.guests !== 1 ? "s" : ""}
            </div>
            <div className="flex justify-between items-center pt-4 border-t">
              <div>
                <div className="text-sm text-muted-foreground">Total Price</div>
                <div className="text-2xl font-bold">${booking.total_price}</div>
                <div className="text-sm text-muted-foreground mt-1">
                  ${booking.properties.price} × {Math.ceil((new Date(booking.check_out).getTime() - new Date(booking.check_in).getTime()) / (1000 * 60 * 60 * 24))} nights
                </div>
              </div>
              <Button 
                variant="destructive" 
                onClick={handleCancel}
                disabled={isLoading}
              >
                {isLoading ? "Cancelling..." : "Cancel Booking"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
