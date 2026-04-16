import _ from "lodash"
import axios from "axios"
import z from "zod"
import { FieldValues, Path } from "react-hook-form"
import { treeifyError } from "zod/v4/core"
import { Key, toast } from "@heroui/react"
import { createElement } from "react"
import { CheckIcon, OctagonXIcon } from "lucide-react"

// prettier-ignore
export const toFailedZodResponse = <T extends FieldValues> (error: z.ZodError<T>): Res<null> => {
	const mapped = treeifyError(error) as ReturnType<typeof treeifyError> & { properties?: Partial<Record <Path<T>, { errors?: Array<string> }>> }

	return {
		ok: false,
    errors: _.mapValues(mapped?.properties, (e) => e?.errors ?? []),
    message: error.message || "Failed to validate your request."
	}
}

// prettier-ignore
export const toSuccessAxiosResponse = <T>(response: T): Res<T> => {
	const generic = response as Res<T>
	
	if (typeof generic?.ok === "boolean") {
		if(!generic.ok) return toFailedAxiosResponse(response)

		return { ok: true, message: generic.message, result: generic.result }
	}

	return {
		ok: true,
		message: "Success",
		result: response,
	}
}

// prettier-ignore
export const toFailedAxiosResponse = <T> (error: unknown): Res<T> => {
  if(axios.isAxiosError(error)) {
		const data = error.response?.data
		if(typeof data?.IsSuccess === "boolean")
			return {
				errors: data.Errors,
				message: data.Message,
				ok: data.IsSuccess
			}

    return error.response?.data
  }

  return {
		ok: false,
    errors: {},
    message: error instanceof Error ? error.message : String(error)
	}
}

// prettier-ignore
export const getErrorMessage = (response: ReturnType<typeof toFailedAxiosResponse>) => {
  if(response.ok) return null
  return _.values(response.errors).flat()?.at(0) || response.message
}

export const toastException = (error: unknown) => {
	const response = toFailedAxiosResponse(error)
	const message = getErrorMessage(response)
	toast(message || response.message, {
		variant: "danger",
		indicator: createElement(OctagonXIcon, { className: "size-4" })
	})
}

export const toastSuccess = <T extends FieldValues | Key>(response: Res<T>) => {
	if (!response.ok) throw response

	return toast(response.message, {
		variant: "success",
		indicator: createElement(CheckIcon, { className: "size-4" })
	})
}
