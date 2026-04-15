"use client"

import {
	cn,
	Label,
	LabelProps,
	NumberField,
	NumberFieldDecrementButtonProps,
	NumberFieldGroupProps,
	NumberFieldIncrementButtonProps,
	NumberFieldInputProps,
	NumberFieldProps,
} from "@heroui/react"

type TNumericInput = {
	label?: string
} & Pick<NumberFieldProps, "value" | "onChange"> &
	WithProperties<{
		field?: Omit<NumberFieldProps, "onChange" | "value">
		label?: LabelProps
		group?: NumberFieldGroupProps
		decrement?: NumberFieldDecrementButtonProps
		increment?: NumberFieldIncrementButtonProps
		input?: NumberFieldInputProps
	}>

// prettier-ignore
export const NumericInput = ({ label, onChange, properties, value }: TNumericInput) => {

  return <NumberField 
    minValue={0} 
    fullWidth 
    { ...properties?.field } 
    className={cn("max-w-32", properties?.field?.className)}
    value={value}
    onChange={onChange}
  >
    <Label { ...properties?.label }>{ label }</Label>
    <NumberField.Group { ...properties?.group }>
      <NumberField.DecrementButton { ...properties?.decrement } />
      <NumberField.Input { ...properties?.input } />
      <NumberField.IncrementButton { ...properties?.increment } />
    </NumberField.Group>
  </NumberField>

}
