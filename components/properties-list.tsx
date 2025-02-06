import { PropertyCard } from "@/components/property-card"
import { getProperties } from "@/lib/services/properties"

interface PropertiesListProps {
  search?: string
}

export async function PropertiesList({ search }: PropertiesListProps) {
  const properties = await getProperties(search)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {properties.map((property) => (
        <PropertyCard
          key={property.id}
          id={property.id}
          title={property.title}
          description={property.description}
          location={property.location}
          price={property.price}
          image_url={property.image_url}
        />
      ))}
      {properties.length === 0 && (
        <div className="col-span-full text-center py-10 text-muted-foreground">
          No properties found.
        </div>
      )}
    </div>
  )
}
