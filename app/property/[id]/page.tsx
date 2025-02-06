import { notFound } from "next/navigation"
import BookingCalculator from '@/components/booking-calculator'
import { PropertyCarousel } from "@/components/property-carousel"
import { PropertyAmenities } from "@/components/property-amenities"
import { getProperty } from "@/lib/services/properties"


export default async function PropertyPage({ params }: { params: { id: string } }) {
  const property = await getProperty(params.id);

  if (!property) {
    notFound();
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">{property.title}</h1>
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-2/3">
          <PropertyCarousel images={property.images} />
          <div className="mt-8">
            <h2 className="text-2xl font-semibold mb-4">About this property</h2>
            <p className="text-muted-foreground">{property.description}</p>
          </div>
          <PropertyAmenities />
        </div>
        <div className="lg:w-1/3">
          <BookingCalculator
            propertyId={property.id}
            price={property.price}
            maxGuests={property.max_guests}
            bedrooms={property.bedrooms}
            bathrooms={property.bathrooms}
            location={property.location}
          />
        </div>
      </div>
    </div>
  );
}
