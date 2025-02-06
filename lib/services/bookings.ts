"use server"

import { createClientComponentClient, createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export interface BookingWithProperty {
  id: string
  property_id: string
  user_id: string
  check_in: string
  check_out: string
  guests: number
  total_price: number
  properties: {
    id: string
    title: string
    description: string
    price: number
    location: string
  }
}

export interface CreateBookingParams {
  propertyId: string
  checkIn: Date
  checkOut: Date
  guests: number
  totalPrice: number
}

export async function getBookings(): Promise<BookingWithProperty[]> {
  const supabase = createServerComponentClient({ cookies })

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return redirect("/login")

  const { data } = await supabase
    .from("bookings")
    .select(`
      id,
      property_id,
      user_id,
      check_in,
      check_out,
      guests,
      total_price,
      properties!inner (
        id,
        title,
        description,
        price,
        location
      )
    `)
    .eq("user_id", user.id)
    .order("check_in", { ascending: true })
    .returns<BookingWithProperty[]>()

  return data || []
}

export async function createBooking({ propertyId, checkIn, checkOut, guests, totalPrice }: CreateBookingParams) {
  const supabase = createServerComponentClient({ cookies })
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("User not authenticated")
  }

  // Formatiranje datuma u lokalni format (YYYY-MM-DD)
  const checkInDate = new Date(checkIn).toLocaleDateString('en-CA') // 'en-CA' daje yyyy-mm-dd format
  const checkOutDate = new Date(checkOut).toLocaleDateString('en-CA') // Isto za checkout

  const { error } = await supabase.from('bookings').insert({
    property_id: propertyId,
    user_id: user.id,
    check_in: checkInDate,  // Lokalni datum
    check_out: checkOutDate, // Lokalni datum
    guests: guests,
    total_price: totalPrice
  })

  if (error) throw error
}

export async function cancelBooking(bookingId: string) {
  const supabase = createServerComponentClient({ cookies })
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("User not authenticated")
  }

  // Prvo proveriti da li ova rezervacija pripada korisniku
  const { data: booking } = await supabase
    .from('bookings')
    .select('user_id')
    .eq('id', bookingId)
    .single()

  if (!booking || booking.user_id !== user.id) {
    throw new Error("Unauthorized")
  }

  const { error } = await supabase
    .from('bookings')
    .delete()
    .eq('id', bookingId)

  if (error) throw error
}

export async function getBookedDates(propertyId: string): Promise<Date[]> {
  const supabase = createClientComponentClient()
  const { data, error } = await supabase
    .from('bookings')
    .select('check_in, check_out')
    .eq('property_id', propertyId)

  if (error) throw error

  const dates: Date[] = []
  data.forEach(({ check_in, check_out }) => {
    let currentDate = new Date(check_in)
    const endDate = new Date(check_out)

    while (currentDate <= endDate) {
      dates.push(new Date(currentDate))
      currentDate.setDate(currentDate.getDate() + 1)
    }
  })

  return dates
}
