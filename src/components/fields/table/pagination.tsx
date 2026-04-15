"use client"

import {
	cn,
	Pagination,
	PaginationContentProps,
	PaginationItemProps,
	PaginationNextIconProps,
	PaginationNextProps,
	PaginationPreviousIconProps,
	PaginationPreviousProps,
	PaginationProps,
	PaginationSummaryProps
} from "@heroui/react"
import { ReactNode, useMemo } from "react"
import { NumericInput } from "../number"
import { Ripple } from "m3-ripple"

type TContent = number | "..."

// prettier-ignore
export type TDataTablePagination = {

  page: number
  totalPages: number
  hidePageNumbers?: boolean
  renderPaginationSummary?: (take: number) => ReactNode
  gotoPage?: (value: number) => void
  next?: {
    text?: string
    canNext?: boolean
    onPress?: VoidFunction
  },
  prev?: {
    text?: string
    canPrev?: boolean
    onPress?: VoidFunction
  }
  count: {
    max?: number
    value: number
    onChange?: (value: number) => void
  }
  locale?: string
} & WithProperties<{
  pagination?: PaginationProps
  paginationSummary?: PaginationSummaryProps
  paginationItem?: PaginationItemProps
  paginationContent?: PaginationContentProps
  paginationPrevButton?: Omit<PaginationPreviousProps, "isDisabled" | "onPress">
  paginationPrevIcon?: PaginationPreviousIconProps
  paginationNextButton?: Omit<PaginationNextProps, "isDisabled" | "onPress">
  paginationNextIcon?: PaginationNextIconProps
}>

// prettier-ignore
export const DataTablePagination = ({ renderPaginationSummary, gotoPage, locale, count, page, totalPages, properties, next, prev, hidePageNumbers }: TDataTablePagination) => {

  const { displayPage, take } = useMemo(() => ({
    take: page * count.value + 1,
    displayPage: page,
  }), [count.value, page])

  const getPageNumbers = () => {
    const content: Array<TContent> = []

    if(totalPages <=7 ) {

      for(let index = 1; index <= totalPages; index ++) {
        content.push(index)
      }

    } else {

      content.push(1)

      if(page > 3) { content.push("...") }

      const start = Math.max(2, page - 1)
      const end = Math.min(totalPages - 1, page + 1)

      for(let index = start; index <= end; index ++) {
        content.push(index)
      }

      if(page < totalPages - 2) {
        content.push("...")
      }

      content.push(totalPages)
    }

    return content
  }

  return <Pagination size="sm" { ...properties?.pagination } className={cn("items-center", properties?.pagination?.className)}>
    <NumericInput
      onChange={count.onChange}
      value={count.value}
      properties={{
        field: {
          maxValue: count.max,
          minValue: 1,
        },
        label: { className: "text-zinc-500 text-xs" }
      }}
      label="Row count"
    />
    <Pagination.Summary { ...properties?.paginationSummary }>
      {
        renderPaginationSummary?. (take) ||
        <div className="flex flex-col">
          <span>{ `Page ${ displayPage.toLocaleString(locale) } of ${ totalPages.toLocaleString(locale) }` }</span>
        </div>
      }
    </Pagination.Summary>
    <Pagination.Content { ...properties?.paginationContent }>
      <Pagination.Item { ...properties?.paginationItem }>
        <Pagination.Previous 
          isDisabled={!prev?.canPrev}
          onPress={prev?.onPress}
          { ...properties?.paginationPrevButton }
        >
          <Ripple />
          <Pagination.PreviousIcon { ...properties?.paginationPrevIcon } />
          <span>{ prev?.text || "Prev" }</span>
        </Pagination.Previous>
      </Pagination.Item>
      {
        hidePageNumbers ? null :
        getPageNumbers().map((current, index) => {
          const isActive = current === page

          if(current === "...")
            return <Pagination.Item key={["e", index].join(":")} { ...properties?.paginationItem }>
              <Pagination.Ellipsis />
            </Pagination.Item>

          return <Pagination.Item 
            key={current} 
            { ...properties?.paginationItem }
          >
            <Pagination.Link 
              isActive={isActive}
              onPress={() => gotoPage?.(current)}
              className={cn(isActive ? "bg-accent/5" : "")}
            >
              <span className={isActive ? "text-accent font-bold" : "font-normal"}>{ current }</span>
            </Pagination.Link>
          </Pagination.Item>
        })
      }
      <Pagination.Item { ...properties?.paginationItem }>
        <Pagination.Next 
          isDisabled={!next?.canNext}
          onPress={next?.onPress}
          { ...properties?.paginationNextButton }
        >
          <Ripple />
          <span>{ next?.text || "Next" }</span>
          <Pagination.NextIcon { ...properties?.paginationNextIcon } />
        </Pagination.Next>
      </Pagination.Item>
    </Pagination.Content>
  </Pagination>

}
