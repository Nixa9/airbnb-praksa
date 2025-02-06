import { Separator } from "@/components/ui/separator"

export default function Footer() {
  return (

    <footer>
      <Separator className="mt-8" />
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm">
            © {new Date().getFullYear()} Airbnb Praksa. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  )
}
