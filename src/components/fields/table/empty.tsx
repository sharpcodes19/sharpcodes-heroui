"use client"

import { Surface } from "@heroui/react"
import { PackageOpenIcon } from "lucide-react"
import { TableBodyRenderProps } from "react-aria-components"

// prettier-ignore
export const RenderEmptyDataTable = ({ isDropTarget, isEmpty }: TableBodyRenderProps) => {

  return <Surface variant="secondary" className="h-full rounded-2xl flex items-center text-center justify-center flex-col">
    <PackageOpenIcon className="size-15 mb-3" />
    <h5 className="text-lg">No records found.</h5>
    <p className="text-sm text-zinc-500">Try adjusting your filters or add new entries.</p>
  </Surface>

}
