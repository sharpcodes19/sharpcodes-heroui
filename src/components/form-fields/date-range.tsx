"use client"

import _ from "lodash"
import { FieldValues, Path } from "react-hook-form"
import { FormField, TFormField } from "./field"
import {
	CalendarYearPickerTriggerHeadingProps,
	CalendarYearPickerTriggerIndicatorProps,
	CalendarYearPickerTriggerProps,
	DateField,
	DateRangePicker,
	DateRangePickerPopoverProps,
	DateRangePickerProps,
	DateRangePickerRangeSeparatorProps,
	DateRangePickerTriggerIndicatorProps,
	DateRangePickerTriggerProps,
	FieldErrorProps,
	Label,
	LabelProps,
	RangeCalendar,
	RangeCalendarGridHeaderProps,
	RangeCalendarHeaderCellProps,
	RangeCalendarHeaderProps,
	RangeCalendarNavButtonProps,
	RangeValue
} from "@heroui/react"
import { parseAbsoluteToLocal, ZonedDateTime } from "@internationalized/date"
import {
	DateInputGroupInputProps,
	DateInputGroupRootProps,
	DateInputGroupSegmentProps,
	DateInputGroupSuffixProps
} from "@heroui/react/date-input-group"
import { FormFieldErrorMessage } from "./error"
import { toMoment } from "../../libs/utils/date"

// prettier-ignore
type TDateRangeFormField <T extends FieldValues, K extends Path<T>> = {
  label: string
  startName: SubPath<T, K>
  endName: SubPath<T, K>
} & TFormField<T, K>
  & WithProperties<{
		picker: Omit<DateRangePickerProps<ZonedDateTime>, "startName" | "endName">
    label?: LabelProps
    error?: FieldErrorProps
    input?: {
      group?: DateInputGroupRootProps
      input?: Omit<DateInputGroupInputProps, "slot">
      segment?: DateInputGroupSegmentProps
      separator?: DateRangePickerRangeSeparatorProps
      trigger?: {
        trigger?: DateRangePickerTriggerProps
        heading?: CalendarYearPickerTriggerHeadingProps
        indicator?: DateRangePickerTriggerIndicatorProps
        suffix?: DateInputGroupSuffixProps
      }
    }
    calendar?: {
      next?: Omit<RangeCalendarNavButtonProps, "slot">
      previous?: Omit<RangeCalendarNavButtonProps, "slot">
      popover?: DateRangePickerPopoverProps
      calendar?: RangeCalendar
      header?: RangeCalendarHeaderProps
      yearPicker?: {
        tigger?: CalendarYearPickerTriggerProps
        heading?: CalendarYearPickerTriggerHeadingProps
        indicator?: CalendarYearPickerTriggerIndicatorProps
      }
      headerCell?: RangeCalendarHeaderCellProps
      gridHeader?: RangeCalendarGridHeaderProps
    }
	}>

// prettier-ignore
export const DateRangeFormField = <T extends FieldValues, K extends Path<T>> ({ startName, endName, properties, label, ...form }: TDateRangeFormField<T, K>) => {

  return <FormField { ...form }>
    {
      ({ field: { onChange, value, ...field }, fieldState }) => {
        const start = _.get(value, startName.split(".").slice(1).join("."))
        const end = _.get(value, startName.split(".").slice(1).join("."))
        const parsed = {
          start: _.isDate(start) ? parseAbsoluteToLocal(start.toISOString()) : undefined,
          end: _.isDate(end) ? parseAbsoluteToLocal(end.toISOString()) : undefined,
        } as RangeValue<ZonedDateTime>

        return <DateRangePicker
          hideTimeZone 
          isInvalid={fieldState.invalid}
          aria-label="date range picker"
          granularity="day" 
          defaultValue={parsed.start && parsed.end ? parsed : undefined}
          { ...properties?.picker }
          { ...field }
          startName={startName}
          endName={endName}
          onChange={(value) => {
            if(!value)
              return onChange(null)

            const { start, end } = value
            const from = toMoment().set({
              month: start.month - 1,
              date: start.day,
              year: start.year,
              hour: start.hour,
              minute: start.minute,
              second: start.second,
              millisecond: start.millisecond
            })
            const to = toMoment().set({
              month: end.month - 1,
              date: end.day,
              year: end.year,
              hour: end.hour,
              minute: end.minute,
              second: end.second,
              millisecond: end.millisecond
            })
            return onChange({
              from: from.toDate(),
              to: to.toDate()
            })
          }}
        >
          <Label { ...properties?.label }>{ label }</Label>
          <DateField.Group variant="secondary" { ...properties?.input?.group }>
            <DateField.Input { ...properties?.input?.input } slot="start">
              {
                (segment) =>
                  <DateField.Segment segment={segment} { ...properties?.input?.segment } />
              }
            </DateField.Input>
            <DateRangePicker.RangeSeparator { ...properties?.input?.separator } />
            <DateField.Input { ...properties?.input?.input } slot="end">
              {
                (segment) =>
                  <DateField.Segment segment={segment} { ...properties?.input?.segment } />
              }
            </DateField.Input>
            <DateField.Suffix { ...properties?.input?.trigger?.suffix }>
              <DateRangePicker.Trigger { ...properties?.input?.trigger?.trigger }>
                <DateRangePicker.TriggerIndicator { ...properties?.input?.trigger?.indicator }/>
              </DateRangePicker.Trigger>
            </DateField.Suffix>
          </DateField.Group>
          <FormFieldErrorMessage fieldState={fieldState} properties={{ error: properties?.error }} />
          <DateRangePicker.Popover placement="bottom end" { ...properties?.calendar?.popover }>
            <RangeCalendar aria-label="calendar period" { ...properties?.calendar?.calendar}>
              <RangeCalendar.Header { ...properties?.calendar?.header }>
                <RangeCalendar.YearPickerTrigger { ...properties?.calendar?.yearPicker?.tigger }>
                  <RangeCalendar.YearPickerTriggerHeading { ...properties?.calendar?.yearPicker?.heading } />
                  <RangeCalendar.YearPickerTriggerIndicator { ...properties?.calendar?.yearPicker?.indicator } />
                </RangeCalendar.YearPickerTrigger>
                <RangeCalendar.NavButton slot="previous" { ...properties?.calendar?.previous } />
                <RangeCalendar.NavButton slot="next" { ...properties?.calendar?.next } />
              </RangeCalendar.Header>

              <RangeCalendar.Grid>
                <RangeCalendar.GridHeader>
                  {
                    (day) =>
                      <RangeCalendar.HeaderCell>{ day }</RangeCalendar.HeaderCell>
                  }
                </RangeCalendar.GridHeader>
                <RangeCalendar.GridBody>
                  {
                    (date) =>
                      <RangeCalendar.Cell date={date} />
                  }
                </RangeCalendar.GridBody>
              </RangeCalendar.Grid>
              <RangeCalendar.YearPickerGrid>
                <RangeCalendar.YearPickerGridBody>
                  {
                    ({ year }) =>
                      <RangeCalendar.YearPickerCell year={year} />
                  }
                </RangeCalendar.YearPickerGridBody>
              </RangeCalendar.YearPickerGrid>
            </RangeCalendar>
          </DateRangePicker.Popover>
        </DateRangePicker>
      }
    }
  </FormField>

}
