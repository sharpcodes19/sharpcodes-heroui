type ReactState<T> = [T, import("react").Dispatch<import("react").SetStateAction<T>>]

type ZodToType<T> = import("zod").output<T>

type SubPath<
	T extends import("react-hook-form").FieldValues,
	K extends import("react-hook-form").Path<T>
> = K extends string ? `${K}.${string}` & import("react-hook-form").Path<T> : never

type ParamKeys<T extends string> = {
	[K in T]: string
}

type DataTableActionKeys = "view" | "edit" | "delete" | "audit" | "files"

type Res<T> = {
	message: string
} & ({ ok: false; errors: Record<string, Array<string>> } | { result: T; ok: true })

type PaginatedResponse<T> = Res<{
	items: Array<T>
	canNext: boolean
	canPrev: boolean
	totalPages: number
}>

type PaginationSchema = {
	page: number
	count: number
	search?: string
	range?: {
		from: Date
		to: Date
	}
}
