import { Button } from "@/components/ui/button"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"

interface DatePickerProps {
  date: Date | undefined
  onSelect: (date: Date | undefined) => void
  label: string
  disabledDates: Date[]
  minDate?: Date
}

export function DatePicker({ date, onSelect, label, disabledDates, minDate }: DatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full justify-start text-left font-normal">
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : label}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={onSelect}
          disabled={(date) =>
            (minDate ? date <= minDate : date <= new Date()) ||
            disabledDates.some(d => d.toDateString() === date.toDateString())
          }
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}
