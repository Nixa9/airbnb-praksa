import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPinIcon } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface PropertyCardProps {
  id: string
  title: string
  description: string
  location: string
  price: number
  image_url: string
}

export function PropertyCard({ id, title, description, location, price, image_url }: PropertyCardProps) {
  return (
    <Card>
      <CardHeader className="p-0">
        <Image
          src={image_url || "/placeholder.svg"}
          alt={title}
          width={600}
          height={400}
          className="object-cover h-48 w-full rounded-t-lg"
        />
      </CardHeader>
      <CardContent className="p-4">
        <CardTitle className="text-xl mb-2">{title}</CardTitle>
        <p className="text-muted-foreground mb-2 line-clamp-2">{description}</p>
        <div className="flex items-center text-muted-foreground mb-2">
          <MapPinIcon className="h-4 w-4 mr-1" />
          <span>{location}</span>
        </div>
        <p className="font-semibold">${price} / night</p>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full">
          <Link href={`/property/${id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
