"use client";

import * as React from "react";
import { DateRange } from "react-day-picker";
import { DateRangePicker } from "@/app/components/ui/date-range-picker";

interface DatePickerWithRangeProps {
  date: {
    from: Date;
    to: Date;
  };
  setDate: (date: DateRange | undefined) => void;
  className?: string;
}

export function DatePickerWithRange({
  date,
  setDate,
  className,
}: DatePickerWithRangeProps) {
  return (
    <DateRangePicker
      value={date}
      onValueChange={setDate}
      className={className}
    />
  );
}
