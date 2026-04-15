"use client"

import _ from "lodash"
import z from "zod"
import { TDataTablePagination, DataTablePagination } from "./pagination"
import useLocalStorageState from "use-local-storage-state"
import {
	Checkbox,
	CheckboxProps,
	cn,
	SortDescriptor,
	Table,
	TableBodyProps,
	TableCellProps,
	TableColumnProps,
	TableColumnResizerProps,
	TableContentProps,
	TableFooterProps,
	TableHeaderProps,
	TableLayout,
	TableProps,
	TableResizableContainerProps,
	TableRowProps,
	TableScrollContainerProps,
	Virtualizer
} from "@heroui/react"
import {
	ColumnDef,
	createColumnHelper,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	RowSelectionState,
	SortDirection,
	SortingState,
	useReactTable
} from "@tanstack/react-table"
import { TableLayoutProps } from "@react-stately/layout"
import { ChevronUp } from "lucide-react"
import { PropsWithChildren, ReactNode, useEffect, useState } from "react"
import { FieldValues, Path } from "react-hook-form"

// prettier-ignore
export type TDataTable <T extends FieldValues, K extends Path<T>> = {
  storageBaseName?: string
  name: string,
  onSelectRows?: (selectedKeys: Array<T[K]>) => void
  rowIdKey: K
  columns: Array<{ key: Path<T>, title: string, hide?: boolean }>
  renderCell?: (consume: { row: T, rowIndex: number }) => Partial<Record<Path<T>, ReactNode>>
  items: Array<T>
} 
  & TDataTablePagination
  & WithProperties<{
    table?: TableProps
    tableContent?: TableContentProps
    scrollContainer?: TableScrollContainerProps
    tableRow?: TableRowProps<T>
    tableColumn?: TableColumnProps
    tableHeader?: TableHeaderProps<T>
    tableFooter?: TableFooterProps
    tableBody?: Omit<TableBodyProps<T>, "items">
    tableCell?: TableCellProps
    tableColumnResizer?: TableColumnResizerProps
    tableReizeableContainer?: TableResizableContainerProps
    virtualization?: TableLayoutProps
  }>

type TSortableColumnHeader = {
	direction: SortDirection | undefined
}

// prettier-ignore
export const DataTable = <T extends FieldValues, K extends Path<T>> ({ name, onSelectRows, columns, items, properties, rowIdKey, renderCell, storageBaseName, ...pagination }: TDataTable<T, K>) => {
  const enableRowSelection = Boolean(onSelectRows)
  const [ columnWidths, setColumnWidths ] = useLocalStorageState([ storageBaseName || "DataTable", name ].join("::"), {
    defaultValue: Object.fromEntries(columns.map(({ key }) => [ key, null ]))
  })
  const [sorting, setSorting] = useState<SortingState>([])
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})

  const table = useReactTable({
    getFilteredRowModel: getFilteredRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    columns: createColumns({ columns }),
    enableRowSelection,
    data: items,
    initialState: {
      pagination: { pageSize: pagination.count.value }
    },
    state: {
      sorting, 
      rowSelection,
      columnVisibility: Object.fromEntries(columns.map((col) => [ col.key, !col.hide ]))
    },
    columnResizeMode: "onEnd",
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
  })
  
  const sortDescriptor = toSortDescriptor(sorting)

  useEffect(() => {
    if(!onSelectRows) return

    const arr = z.coerce.number().array().safeParse(Object.keys(rowSelection))
    if(arr.success) {
      const keys = arr.data
        .map((index) => _.get(items[index], rowIdKey) ?? null)
        .filter((item) => item !== null)
      // @ts-expect-error keys
      onSelectRows(keys)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rowSelection, items, rowIdKey])

  return <Virtualizer
    layout={TableLayout}
    layoutOptions={{
      headingHeight: 42,
      rowHeight: 52,
      ...properties?.virtualization
    }}
  >
    <Table
      { ...properties?.table }
      className={cn("min-h-[50dvh]", properties?.table?.className)}
    >
      <Table.ScrollContainer { ...properties?.scrollContainer }>
        <Table.ResizableContainer 
          onResize={(...map) => {
            const next = Object.fromEntries(
              Array.from(map.entries())
                    .map(([ key, value ]) => [ String(key), 
                      Object.fromEntries(value)
                    ])
            )
            // @ts-expect-error next[0]
            setColumnWidths(next[0])
          }}
          { ...properties?.tableReizeableContainer }
        >
          <Table.Content
            aria-label="tanstack usable data table"
            sortDescriptor={sortDescriptor}
            onSortChange={(s) => setSorting(toSortingState(s))}
            { ...properties?.tableContent }
            className={cn("w-full overflow-x-auto", properties?.tableContent?.className)}
          >
            <Table.Header { ...properties?.tableHeader }>
              {
                !enableRowSelection ? null :
                <Table.Column maxWidth={20}>
                  <InditerminateCheckbox 
                    id="all"
                    properties={{
                      checkbox: {
                        "aria-label": "Select all",
                        variant: "primary",
                        className: "w-fit"
                      }
                    }}
                    // onChange={table.getToggleAllRowsSelectedHandler()}
                    onChange={table.toggleAllRowsSelected}
                    isSelected={table.getIsAllRowsSelected()}
                    isIndeterminate={table.getIsSomeRowsSelected()}
                  />
                </Table.Column>
              }
              {
                table.getHeaderGroups().at(0)?.headers.map((header, index) => {
                  // @ts-expect-error width
                  return <Table.Column
                    key={header.id}
                    id={header.id}
                    isRowHeader={index === 0}
                    allowsSorting={header.column.getCanSort()} 
                    { ...properties?.tableColumn }
                    defaultWidth={columnWidths?.[header.id]}
                    className={cn("rounded-none p-0", properties?.tableColumn?.className)}
                  >
                    {
                      ({ sortDirection }) =>
                        // @ts-expect-error direction
                        <SortableColumnHeader direction={sortDirection}>
                          { flexRender(header.column.columnDef.header, header.getContext()) }
                          <Table.ColumnResizer
                            { ...properties?.tableColumnResizer }
                          />
                        </SortableColumnHeader>
                    }
                  </Table.Column>
                })
              }
            </Table.Header>
            <Table.Body { ...properties?.tableBody }>
              {
                table.getRowModel().rows.map((row, rowIndex) => {
                  return <Table.Row
                    key={row.id}
                    id={row.id}
                    { ...properties?.tableRow }
                  >
                    {
                      !enableRowSelection ? null :
                      <Table.Cell className="pr-0" key={row.id}>
                        <InditerminateCheckbox
                          id={row.id}
                          label={ String(_.get(row, rowIdKey)) } 
                          onChange={row.getToggleSelectedHandler()}
                          isSelected={row.getIsSelected()}
                          isIndeterminate={row.getIsSomeSelected()}
                          properties={{
                            checkbox: {
                              className: "w-fit"
                            }
                          }}
                        />
                      </Table.Cell>
                    }
                    {
                      row.getVisibleCells().map((cell) => {
                        const original = row.original
                          // @ts-expect-error cell
                        return <Table.Cell key={cell.id} { ...properties?.tableCell } className={cn("whitespace-nowrap flex items-center", properties?.tableCell?.className)}>
                          { 
                            renderCell?.({ row: original, rowIndex })?.[cell.column.id as Path<T>] ??
                            flexRender(cell.column.columnDef.cell, cell.getContext())
                          }
                        </Table.Cell>
                      })
                    }
                  </Table.Row>
                })
              }
            </Table.Body>
          </Table.Content>
        </Table.ResizableContainer>
      </Table.ScrollContainer>
      <Table.Footer { ...properties?.tableFooter } className={cn("flex items-end", properties?.tableFooter?.className)}>
        <DataTablePagination
          { ...pagination }
          properties={properties}
          prev={{
            ...pagination.prev,
            onPress: pagination.prev?.onPress ?? table.previousPage,
            canPrev: pagination.prev?.canPrev ?? table.getCanPreviousPage(),
          }}
          next={{
            ...pagination.next,
            onPress: pagination.next?.onPress ?? table.nextPage,
            canNext: pagination.next?.canNext ?? table.getCanNextPage(),
          }}
        />
      </Table.Footer>
    </Table>
  </Virtualizer>
}

// prettier-ignore
const createColumns = <T extends FieldValues, K extends Path<T>>({ columns }: Pick<TDataTable<T, K>, "columns">): Array<ColumnDef<T>> => {
  const helper = createColumnHelper<T>()

  // @ts-expect-error columnKey
  return columns.map((column) => helper.accessor(column.key, {
    header: column.title
  }))
}

// prettier-ignore
const toSortDescriptor = (sorting: SortingState): SortDescriptor | undefined => {
  const first = _.head(sorting)
  if (!first) return undefined

  return {
    column: first.id,
    direction: first.desc ? "descending" : "ascending",
  }
}

// prettier-ignore
const toSortingState = (descriptor: SortDescriptor): SortingState => {
  return [ { desc: descriptor.direction === "descending", id: String(descriptor.column) } ]
}

// prettier-ignore
const SortableColumnHeader = ({ children, direction }: PropsWithChildren<TSortableColumnHeader>) => {

  return <div className="flex items-center gap-x-2 p-4 header-cell truncate">
    { children }
    {
      !direction ? null :
      <ChevronUp
        className={cn(
          "transform size-3 transition-transform duration-100 ease-out",
          // @ts-expect-error overlap
          direction === "descending" ? "rotate-180" : ""
        )}
      />
    }
  </div>

}

// prettier-ignore
type TInditerminateCheckbox = { label?: string } 
  & WithProperties<{
	  checkbox?: Omit<CheckboxProps, "isSelected" | "onChange" | "isIndeterminate" | "slot" | "id">
  }>
  & Pick<CheckboxProps, "isSelected" | "onChange" | "isIndeterminate" | "id" | "isDisabled">

// prettier-ignore
const InditerminateCheckbox = ({ label, properties, ...rest }: TInditerminateCheckbox) => {
	return <Checkbox
    aria-label={`Select row ${label || "" }`.trim()}
    slot="selection"
    variant="secondary"
    isDisabled={false}
    { ...properties?.checkbox }
    { ...rest }
  >
    <Checkbox.Control>
      <Checkbox.Indicator />
    </Checkbox.Control>
  </Checkbox>
}
