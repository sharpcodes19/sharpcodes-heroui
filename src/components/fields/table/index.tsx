"use client"

import _ from "lodash"
import z from "zod"
import { ButtonProps, cn } from "@heroui/react"
import {
	FilesIcon,
	InfoIcon,
	LucideIcon,
	PencilIcon,
	ShieldAlertIcon,
	TrashIcon
} from "lucide-react"
import { createElement, ReactNode } from "react"
import { RippledButton } from "../button"
import { toMoment } from "../../../libs/utils/date"

export { DataTable, type TDataTable } from "./base"
export { RenderEmptyDataTable } from "./empty"
export { DataTablePagination, type TDataTablePagination } from "./pagination"

// prettier-ignore
export const RenderDateRangeDataTableValue = ({ dates: [ from, to ] }: { dates: [Date, Date] }) => {

  return <div className="flex gap-x-2 items-center">
    <div className="w-20.5">{ toMoment(from).format("ll") }</div>
    <span className="mr-1">-</span>
    <div>{ toMoment(to).format("ll") }</div>
  </div>

}

// prettier-ignore
export const RenderDateTimeDataTableValue = ({ date }: { date: Date }) => {

  return <div className="flex gap-x-2 items-center">
    <div className="w-20.5">{ toMoment(date).format("ll") }</div>
    <span className="mr-1">-</span>
    <div>{ toMoment(date).format("hh:mm A") }</div>
  </div>

}

// prettier-ignore
export const RenderCurrencyDataTableValue = ({ isNegativeDanger, value }: { isNegativeDanger?: boolean, value: string | number | null | undefined }) => {
  if(_.isNil(value)) return null

  const schema = z.coerce.number().safeParse(value)
  if(!schema.success) return value

  return <div className="flex gap-x-2 items-center">
    <div className={cn("w-20.5", isNegativeDanger && schema.data < 0 ? "text-danger" : "")}>
      {
        Intl.NumberFormat("en-PH", {
          style: "currency",
          currency: "PHP"
        }).format(schema.data)
      }
    </div>
  </div>

}

// prettier-ignore
export const RenderActionDataTableValue = <T extends Partial<Record<DataTableActionKeys, { onPress: VoidFunction, tooltip?: string }>>> (props: T) => {
  const options = { 
    view: {
      icon: InfoIcon,
      variant: "tertiary"
    }, 
    edit: {
      icon: PencilIcon,
      variant: "tertiary"
    }, 
    delete: {
      icon: TrashIcon,
      variant: "danger-soft"
    },
    audit: {
      icon: ShieldAlertIcon,
      variant: "tertiary"
    },
    files: {
      icon: FilesIcon,
      variant: "secondary"
    }
  } as Record<DataTableActionKeys, {
    icon: LucideIcon
  } & Pick<ButtonProps, "variant">>

  const items = Object.entries(props).reduce((acc, [ k, value ]) => {
    const key = k as DataTableActionKeys
    const { onPress, tooltip } = value

    acc[key] = <RippledButton
      key={key}
      properties={{
        button: { 
          size: "sm", 
          isIconOnly: true, 
          variant: options[key].variant 
        }
      }}
      tooltipContent={tooltip}
      onPress={onPress}
      type="button"
    >
      { 
        createElement(options[key].icon, 
          { className: "size-4" })
      }
    </RippledButton>
    
    return acc
    
  }, {} as Record<DataTableActionKeys, ReactNode>)


  return <div className="flex gap-2">
    { Object.values(items) }
  </div>

}
