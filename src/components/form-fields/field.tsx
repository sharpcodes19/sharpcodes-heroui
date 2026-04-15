import { cn } from "@heroui/styles"
import { ReactNode } from "react"
import {
	Control,
	FieldValues,
	Path,
	Controller,
	ControllerProps,
} from "react-hook-form"

// prettier-ignore
export type TFormField<T extends FieldValues, K extends Path<T>> = {
	name: K
	control: Control<T>
	className?: string
}

// prettier-ignore
export const FormField = <T extends FieldValues, K extends Path<T>> ({ className, children, control, name }: TFormField<T, K> & { children: (props: Parameters<ControllerProps<T>["render"]>[0]) => ReactNode }) => {

  return <Controller
    name={name}
    control={control}
    render={ 
			(...consume) =>
				<div className={cn("flex-col flex grow gap-y-1.5 gap-x-2", className)}>
					{ children(...consume) }
				</div>
		}
  />

}
