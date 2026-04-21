export type ReactState<T> = [
	T,
	import("react").Dispatch<import("react").SetStateAction<T>>
]

export type ZodToType<T> = import("zod").output<T>

export type SubPath<
	T extends import("react-hook-form").FieldValues,
	K extends import("react-hook-form").Path<T>
> = K extends string ? `${K}.${string}` & import("react-hook-form").Path<T> : never

export type ParamKeys<T extends string> = {
	[K in T]: string
}

export type DataTableActionKeys = "view" | "edit" | "delete" | "audit" | "files"

export type Res<T> = {
	message: string
} & ({ ok: false; errors: Record<string, Array<string>> } | { result: T; ok: true })

export type PaginatedResponse<T> = Res<{
	items: Array<T>
	canNext: boolean
	canPrev: boolean
	totalPages: number
}>

export type PaginationSchema = {
	page: number
	count: number
	search?: string
	range?: {
		from: Date
		to: Date
	}
}
