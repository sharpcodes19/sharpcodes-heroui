/* eslint-disable react-hooks/set-state-in-effect */
import _ from "lodash"
import { useQuery } from "@tanstack/react-query"
import { useEffect, useMemo, useState } from "react"
import { useDebounce } from "react-haiku"
import { FieldValues } from "react-hook-form"
import { DateRangeItem } from "../components"
import { localApi, toMoment } from "../libs"

type TFilter = {
	key: string
	values: Array<number | string>
}

// prettier-ignore
type TUsePagination = {
	initial?: Partial<PaginationSchema>
	url: string
	name: string
	filters?: Array<TFilter>
  isDisabled?: boolean
}

type TUsePaginationLocalCalculator<T extends FieldValues> = {
	pageIndex: number
	items: Array<T>
	rowCount: number
	search?: string
}

// prettier-ignore
export const usePagination = <T extends FieldValues, IsPaginated extends boolean = true> ({ isDisabled, filters, name, url, initial }: TUsePagination) => {
  const [page, setPage] = useState(1)
  const [count, setCount] = useState(10)
  const [search, setSearch] = useState("")
  const [dateRange, setDateRange] = useState<DateRangeItem | null>({
    from: toMoment().startOf("date").toDate(),
    to: toMoment().endOf("date").toDate()
  })

  const debounced = useDebounce({ search, page, count }, 300)
  const debouncedDateRangeValue = useDebounce(dateRange, 300)
  const serializedFilters = useMemo(() => normalizeFilters(filters), [filters])
  const serializedDateRange = useMemo(() => normalizeDateRange(debouncedDateRangeValue ?? undefined), [debouncedDateRangeValue])

  const query = useQuery<IsPaginated extends true ? PaginatedResponse<T> : Res<T>, Res<never>>({
    enabled: !isDisabled,
    queryKey: [ name, url, debounced.page, debounced.count, debounced.search, serializedDateRange, serializedFilters ],
    queryFn: async ({ signal }) => {

      const params = new URLSearchParams()

      params.set("page", page.toString())
      params.set("count", count.toString())

      if(debounced.search)
        params.set("search", debounced.search)

      if(dateRange) {
        const { from, to } = dateRange
        params.set("from", toMoment(from).format("YYYY-MM-DD"))
        params.set("to", toMoment(to).format("YYYY-MM-DD"))
      }

      if(filters?.length) {
        for(const { key, values } of filters) {
          
          params.set(key, values.join(","))

        }
      }

      return localApi.get(url, { signal, params })
        .then(({ data }) => data.ok ? data : null)
    },
    placeholderData: (prev) => prev,
    staleTime: 1000 * 30
  })

  useEffect(() => {

    setCount((count) => initial?.count ?? count)
    setPage((page) => initial?.page ?? page)
    setSearch((search) => initial?.search ?? search)
    setDateRange((range) => initial?.range ?? range)

  }, [initial])

  useEffect(() => {
    setPage(1)
  }, [ debounced.count, debounced.search, serializedFilters, serializedDateRange ])

  return {
    query,
    page, setPage,
    count, setCount,
    search, setSearch,
    dateRange, setDateRange
  }

}

// prettier-ignore
const normalizeFilters = (filters: TUsePagination["filters"]) =>
  _(filters).map((f) => ({
    key: f.key,
    values: _.sortBy(f.values)
  }))
    .sortBy("key")
    .value()

// prettier-ignore
const normalizeDateRange = (range: PaginationSchema["range"]) => {
  if (!range?.from || !range?.to) return ""

  const from = toMoment(range.from).format("YYYY-MM-DD")
  const to = toMoment(range.to).format("YYYY-MM-DD")

  return [ from, to ].join("_")
}

// prettier-ignore
export const usePaginationLocalCalculator = <T extends FieldValues> ({ items, pageIndex, rowCount, search }: TUsePaginationLocalCalculator<T>) => {

  const [canPrev, setCanPrev] = useState<boolean>(false)
  const [canNext, setCanNext] = useState<boolean>(false)
  const [currentData, setCurrentData] = useState(items)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {

    const filteredItems = search
      ? items.filter((item) => JSON.stringify(item).toLowerCase().includes(search.toLowerCase()))
      : items
    const totalPages = Math.ceil(filteredItems.length / rowCount) || 1
    const canPrev = (pageIndex + 1) > 1
    const canNext = (pageIndex + 1) < totalPages
    const startIndex = pageIndex * rowCount
    const data = filteredItems.slice(startIndex, startIndex + rowCount)
    
    setCurrentData(data)
    setCanNext(canNext)
    setCanPrev(canPrev)
    setTotalPages(totalPages)

  }, [items, pageIndex, search, rowCount])

  return { canPrev, canNext, currentData, totalPages }
}
