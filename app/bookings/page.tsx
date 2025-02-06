import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { BookingCard } from "@/components/booking-card"
import { getBookings } from "@/lib/services/bookings"

export const dynamic = 'force-dynamic'

export default async function BookingsPage() {
  const bookings = await getBookings()

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Your Bookings</h1>
      <div className="grid grid-cols-3 gap-6">
        {bookings?.map((booking) => (
          <BookingCard key={booking.id} booking={booking} />
        ))}
        {!bookings?.length && (
          <Card>
            <CardHeader>
              <CardTitle>No bookings yet</CardTitle>
              <p className="text-muted-foreground">
                When you book a property, it will appear here.
              </p>
            </CardHeader>
          </Card>
        )}
      </div>
    </div>
  )
}
