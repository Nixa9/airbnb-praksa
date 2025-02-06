"use server"

import { createServerComponentClient, createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

interface Property {
  id: string
  title: string
  description: string
  price: number
  max_guests: number
  bedrooms: number
  bathrooms: number
  location: string
  images: string[]
}

interface PropertyWithImage extends Omit<Property, 'images'> {
  property_images: { image_url: string }[] | null
}

export async function getProperties(search?: string) {
  const supabase = createServerComponentClient({ cookies })

  const { data: propertiesData, error } = await supabase
    .from("properties")
    .select(`
      *,
      property_images (
        image_url
      )
    `)
    .returns<PropertyWithImage[]>()

  if (error) {
    console.error("Error fetching properties:", error)
    return []
  }

  const properties = (propertiesData || [])
    .map(property => ({
      ...property,
      image_url: property.property_images?.[0]?.image_url || "/placeholder.svg"
    }))
    .filter(property =>
      !search ||
      property.title.toLowerCase().includes(search.toLowerCase()) ||
      property.description.toLowerCase().includes(search.toLowerCase()) ||
      property.location.toLowerCase().includes(search.toLowerCase())
    )

  return properties
}

export interface CreatePropertyParams {
  title: string
  description: string
  price: number
  location: string
  bedrooms: number
  bathrooms: number
  max_guests: number
  image_url: string
}

export async function createProperty(data: CreatePropertyParams) {
  const supabase = createClientComponentClient()

  const { image_url, ...propertyData } = data

  // Create property
  const { data: property, error: propertyError } = await supabase
    .from("properties")
    .insert([propertyData])
    .select()
    .single()

  if (propertyError) {
    throw propertyError
  }

  // Create property image
  const { error: imageError } = await supabase
    .from("property_images")
    .insert([{
      property_id: property.id,
      image_url
    }])

  if (imageError) {
    throw imageError
  }

  return {
    ...property,
    image_url
  }
}

export async function getProperty(id: string): Promise<Property | null> {
  const supabase = createServerComponentClient({ cookies })

  const { data, error } = await supabase
    .from("properties")
    .select(`
      *,
      property_images (
        image_url
      )
    `)
    .eq("id", id)
    .single()

  if (error || !data) {
    console.error("Error fetching property:", error)
    return null
  }

  const property = data as PropertyWithImage

  return {
    id: property.id,
    title: property.title,
    description: property.description,
    price: property.price,
    max_guests: property.max_guests,
    bedrooms: property.bedrooms,
    bathrooms: property.bathrooms,
    location: property.location,
    images: property.property_images?.map(img => img.image_url) || ["/placeholder.svg"]
  }
}
