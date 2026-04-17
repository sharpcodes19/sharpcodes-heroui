"use client"

import {
	Button,
	ButtonProps,
	cn,
	Spinner,
	SpinnerProps,
	Tooltip,
	TooltipContentProps,
	TooltipProps
} from "@heroui/react"
import { Ripple, RippleProps } from "m3-ripple"
import { PropsWithChildren, ReactNode } from "react"

type TRippledButton = {
	tooltipContent?: ReactNode
	isLoading?: boolean
} & Pick<ButtonProps, "onPress" | "type"> &
	WithProperties<{
		ripple?: RippleProps
		button?: Omit<ButtonProps, "type" | "onPress">
		tooltip?: Partial<Omit<TooltipProps, "isDisabled">>
		tooltipContent?: TooltipContentProps
		spinner?: SpinnerProps
	}>

// prettier-ignore
export const RippledButton = ({ onPress, isLoading, type, tooltipContent, children, properties }: PropsWithChildren<TRippledButton>) => {

  return <Tooltip delay={0} isDisabled={!tooltipContent} { ...properties?.tooltip }>
    <Tooltip.Content { ...properties?.tooltipContent }>{ tooltipContent }</Tooltip.Content>
		<Button
			type={type}
			variant="secondary" 
			isPending={isLoading}
			{ ...properties?.button }
			className={cn("font-semibold text-xs active:scale-95 shadow transition-all", properties?.button?.className)}
			onPress={onPress}
		>
			<Ripple { ...properties?.ripple } />
			{
				isLoading ?
					<Spinner size="sm" { ...properties?.spinner } className={cn("text-accent-foreground", properties?.spinner?.className)} /> : null
			}
			{ isLoading && properties?.button?.isIconOnly ? null : children }
		</Button>
  </Tooltip>

}
