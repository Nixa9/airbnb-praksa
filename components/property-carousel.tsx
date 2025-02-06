import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import Image from "next/image"

interface PropertyCarouselProps {
  images: string[]
}

export function PropertyCarousel({ images }: PropertyCarouselProps) {
  return (
    <Carousel className="w-full max-w-4xl mx-auto">
      <CarouselContent>
        {images.map((image, index) => (
          <CarouselItem key={index}>
            <Image
              src={image}
              alt={`Property image ${index + 1}`}
              width={800}
              height={600}
              className="rounded-lg object-cover w-full h-[400px]"
            />
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  )
}
