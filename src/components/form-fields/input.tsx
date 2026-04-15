"use client"

import { FieldValues, Path } from "react-hook-form"
import {
	cn,
	Description,
	DescriptionProps,
	FieldErrorProps,
	InputGroup,
	InputGroupInputProps,
	InputGroupPrefixProps,
	InputGroupSuffixProps,
	Label,
	LabelProps,
	NumberField,
	NumberFieldDecrementButtonProps,
	NumberFieldGroupProps,
	NumberFieldIncrementButtonProps,
	NumberFieldInputProps,
	NumberFieldProps,
	TextField,
	TextFieldProps,
} from "@heroui/react"
import { FormField, TFormField } from "./field"
import { FormFieldErrorMessage } from "./error"
import { ReactNode } from "react"

// prettier-ignore
type TInputFormField <T extends FieldValues, K extends Path<T>> = {
  label?: string
  description?: string
  startComponent?: ReactNode
  endComponent?: ReactNode
} & TFormField<T, K>
  & WithProperties<{
		input?: InputGroupInputProps
		field?: TextFieldProps
    label?: LabelProps
    error?: FieldErrorProps
    description?: DescriptionProps
    prefix?: InputGroupPrefixProps
    suffix?: InputGroupSuffixProps
  }>

// prettier-ignore
type TNumberInputFormField<T extends FieldValues, K extends Path<T>> = {
  label?: string
  description?: string
} & TFormField<T, K>
  & WithProperties<{
    field?: Omit<NumberFieldProps, "value" | "onChange">
    label?: LabelProps
    error?: FieldErrorProps
    description?: DescriptionProps
    group?: NumberFieldGroupProps
    decrement?: NumberFieldDecrementButtonProps
    input?: NumberFieldInputProps
    increment?: NumberFieldIncrementButtonProps
  }>

// prettier-ignore
export const InputFormField = <T extends FieldValues, K extends Path<T>> ({ endComponent, startComponent, description, properties, label, ...form }: TInputFormField<T, K>) => {

  return <FormField { ...form }>
    {
      ({ field, fieldState }) =>
        <TextField fullWidth variant="secondary" { ...properties?.field }>
          <Label { ...properties?.label }>{ label }</Label>
          <InputGroup>
            {
              !startComponent ? null :
              <InputGroup.Prefix { ...properties?.prefix }>
                { startComponent }
              </InputGroup.Prefix>
            }
            <InputGroup.Input
              { ...properties?.input } 
              { ...field }
            />
            {
              !endComponent ? null :
              <InputGroup.Suffix { ...properties?.suffix }>
                { endComponent }
              </InputGroup.Suffix>
            }
          </InputGroup>
          <Description { ...properties?.description } className={cn("px-3 py-1", properties?.description?.className)}>{ description }</Description>
          <FormFieldErrorMessage fieldState={fieldState} properties={{ error: properties?.error }} />
        </TextField>
    }
  </FormField>

}

// prettier-ignore
export const NumberInputFormField = <T extends FieldValues, K extends Path<T>> ({ label, description, properties, ...form }: TNumberInputFormField<T, K>) => {

  return (
    <FormField {...form}>
      {
        ({ field, fieldState }) => (
          <NumberField
            variant="secondary"
            {...properties?.field}
            value={field.value}
            onChange={field.onChange}
          >
            <Label {...properties?.label}>{label}</Label>
            <NumberField.Group { ...properties?.group }>
              <NumberField.DecrementButton { ...properties?.decrement } />
              <NumberField.Input { ...properties?.input } />
              <NumberField.IncrementButton { ...properties?.increment } />
            </NumberField.Group>
            <Description {...properties?.description} className={cn("px-3 py-1", properties?.description?.className)}>
              {description}
            </Description>
            <FormFieldErrorMessage
              fieldState={fieldState}
              properties={{ error: properties?.error }}
            />
          </NumberField>
      )}
    </FormField>
  )
}
