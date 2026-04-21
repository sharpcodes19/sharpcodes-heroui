"use client"

import { FieldValues, Path } from "react-hook-form"
import { FormField, TFormField } from "./field"
import {
	CalendarYearPickerTriggerHeadingProps,
	CalendarYearPickerTriggerIndicatorProps,
	CalendarYearPickerTriggerProps,
	DateField,
	DatePicker,
	DatePickerPopoverProps,
	DatePickerProps,
	DatePickerTriggerProps,
	Calendar,
	CalendarGridHeaderProps,
	CalendarHeaderCellProps,
	CalendarHeaderProps,
	LabelProps,
	FieldErrorProps,
	Label,
	TimeField,
	CalendarNavButtonProps,
	DatePickerTriggerIndicatorProps,
	cn
} from "@heroui/react"
import { ZonedDateTime, parseAbsoluteToLocal } from "@internationalized/date"
import {
	DateInputGroupInputProps,
	DateInputGroupRootProps,
	DateInputGroupSegmentProps,
	DateInputGroupSuffixProps
} from "@heroui/react/date-input-group"
import { FormFieldErrorMessage } from "./error"
import { toMoment } from "../../libs/utils/date"
import _ from "lodash"
import { WithProperties } from "../../types/properties"

// prettier-ignore
type TDateFormField <T extends FieldValues, K extends Path<T>> = {
  label?: string
} & TFormField<T, K>
  & WithProperties<{
		picker: Omit<DatePickerProps<ZonedDateTime>, "startName" | "endName">
    label?: LabelProps
    error?: FieldErrorProps
    input?: {
      group?: DateInputGroupRootProps
      input?: Omit<DateInputGroupInputProps, "slot">
      segment?: DateInputGroupSegmentProps
      trigger?: {
        trigger?: DatePickerTriggerProps
        heading?: CalendarYearPickerTriggerHeadingProps
        indicator?: DatePickerTriggerIndicatorProps
        suffix?: DateInputGroupSuffixProps
      }
    }
    calendar?: {
      popover?: Partial<DatePickerPopoverProps>
      calendar?: Calendar
      header?: CalendarHeaderProps
      next?: Omit<CalendarNavButtonProps, "slot">
      previous?: Omit<CalendarNavButtonProps, "slot">
      yearPicker?: {
        tigger?: CalendarYearPickerTriggerProps
        heading?: CalendarYearPickerTriggerHeadingProps
        indicator?: CalendarYearPickerTriggerIndicatorProps
      }
      headerCell?: CalendarHeaderCellProps
      gridHeader?: CalendarGridHeaderProps
    }
	}>

// prettier-ignore
export const DateFormField = <T extends FieldValues, K extends Path<T>> ({ label, properties, ...form }: TDateFormField<T, K>) => {

  const showTimePicker = properties?.picker?.granularity && [ "hour", "minute", "second" ].includes(properties.picker.granularity)

  return <FormField { ...form }>
    {
      ({ field: { value, onChange, ...field }, fieldState }) =>
        <DatePicker
          hideTimeZone 
          isInvalid={fieldState.invalid}
          aria-label={label || "date picker"} 
          value={_.isDate(value) ? parseAbsoluteToLocal(value.toISOString()) : undefined}
          shouldCloseOnSelect={!showTimePicker}
          { ...properties?.picker }
          { ...field }
          onChange={(value) => {
            if(!value) return onChange(null)

            const date = toMoment().set({
              month: value.month - 1,
              date: value.day,
              year: value.year,
              hour: value.hour,
              minute: value.minute,
              second: value.second,
              millisecond: value.millisecond
            })
            return onChange(date.toDate())
          }}
        >
          <Label { ...properties?.label }>{ label }</Label>
          <DateField.Group variant="secondary" { ...properties?.input?.group }>
            <DateField.Input { ...properties?.input?.input }>
              {
                (segment) =>
                  <DateField.Segment segment={segment} { ...properties?.input?.segment } />
              }
            </DateField.Input>
            <DateField.Suffix { ...properties?.input?.trigger?.suffix }>
              <DatePicker.Trigger { ...properties?.input?.trigger?.trigger }>
                <DatePicker.TriggerIndicator { ...properties?.input?.trigger?.indicator }/>
              </DatePicker.Trigger>
            </DateField.Suffix>
          </DateField.Group>
          <FormFieldErrorMessage fieldState={fieldState} properties={{ error: properties?.error }} />
          <DatePicker.Popover placement="bottom end" { ...properties?.calendar?.popover } className={cn("min-w-64", properties?.calendar?.popover?.className) }>
            <Calendar aria-label="calendar period" { ...properties?.calendar?.calendar}>
              <Calendar.Header { ...properties?.calendar?.header }>
                <Calendar.YearPickerTrigger { ...properties?.calendar?.yearPicker?.tigger }>
                  <Calendar.YearPickerTriggerHeading { ...properties?.calendar?.yearPicker?.heading } />
                  <Calendar.YearPickerTriggerIndicator { ...properties?.calendar?.yearPicker?.indicator } />
                </Calendar.YearPickerTrigger>
                <Calendar.NavButton slot="previous" { ...properties?.calendar?.previous } />
                <Calendar.NavButton slot="next" { ...properties?.calendar?.next } />
              </Calendar.Header>
              <Calendar.Grid>
                <Calendar.GridHeader>
                  {
                    (day) =>
                      <Calendar.HeaderCell>{ day }</Calendar.HeaderCell>
                  }
                </Calendar.GridHeader>
                <Calendar.GridBody>
                  {
                    (date) =>
                      <Calendar.Cell date={date} />
                  }
                </Calendar.GridBody>
              </Calendar.Grid>
              <Calendar.YearPickerGrid>
                <Calendar.YearPickerGridBody>
                  {
                    ({ year }) =>
                      <Calendar.YearPickerCell year={year} />
                  }
                </Calendar.YearPickerGridBody>
              </Calendar.YearPickerGrid>
            </Calendar>
            
            {
              showTimePicker ?
                <div className="flex items-center justify-between">
                  <Label />
                  <TimeField
                    defaultValue={value}
                    shouldForceLeadingZeros={properties?.picker?.shouldForceLeadingZeros}
                    hideTimeZone={properties?.picker?.hideTimeZone}
                    aria-label={label?.concat(" time ") || "time picker"} 
                    hourCycle={properties?.picker?.hourCycle}
                    onChange={
                      (timeValue) => {
                        if(!timeValue) return

                        const date = toMoment(value).set({
                          hour: timeValue.hour,
                          minute: timeValue.minute,
                          second: timeValue.second,
                          millisecond: timeValue.millisecond
                        })

                        return onChange(date.toDate())
                      }
                    }
                  >
                    <TimeField.Group variant="secondary">
                      <TimeField.Input>
                        {(segment) => <TimeField.Segment segment={segment} />}
                      </TimeField.Input>
                    </TimeField.Group>
                  </TimeField>
                </div>
              : null
            }

          </DatePicker.Popover>
        </DatePicker>
    }
  </FormField>

}
