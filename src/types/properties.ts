export type WithProperties<T> = {
	properties?: {
		[P in keyof T]?: Partial<Omit<NonNullable<T[P]>, "children">>
	}
}
