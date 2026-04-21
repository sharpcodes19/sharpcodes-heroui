"use client"

import { FieldError, FieldErrorProps } from "@heroui/react"
import { ControllerFieldState } from "react-hook-form"
import { WithProperties } from "../../types/properties"

type TFormFieldErrorMessage = {
	fieldState: ControllerFieldState
} & WithProperties<{
	error?: FieldErrorProps
}>

// prettier-ignore
export const FormFieldErrorMessage = ({ fieldState, properties }: TFormFieldErrorMessage) => {

  return <FieldError {...properties?.error}> { fieldState.error?.message || fieldState.error?.root?.message }</FieldError>

}
