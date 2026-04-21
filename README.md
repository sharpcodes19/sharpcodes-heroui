# sharpcodes-heroui

Reusable React components, form helpers, table utilities, and client/server helpers built on top of HeroUI.

## Installation

```bash
npm install sharpcodes-heroui
```

Install the required peer dependencies in your app:

```bash
npm install react react-dom @heroui/react @tanstack/react-query @tanstack/react-table react-hook-form @hookform/resolvers zod axios lodash moment-timezone lucide-react react-haiku
```

## Quick Start

```tsx
import { RippledButton, Modal } from "sharpcodes-heroui"

export function Example() {
	return (
		<div className="flex gap-3">
			<RippledButton type="button">Save</RippledButton>
			<Modal
				isOpen
				heading="Example"
				description="Built with HeroUI primitives."
				onOpenChange={() => {}}
			>
				<div className="p-4">Modal content</div>
			</Modal>
		</div>
	)
}
```

## React Hook Form Example

```tsx
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { InputFormField, DateFormField, toDefaultValues } from "sharpcodes-heroui"

const schema = z.object({
	name: z.string().min(1, "Name is required"),
	birthDate: z.date().nullable()
})

type FormValues = z.infer<typeof schema>

export function SampleForm() {
	const { control, handleSubmit } = useForm<FormValues>({
		resolver: zodResolver(schema),
		defaultValues: toDefaultValues(schema)
	})

	return (
		<form onSubmit={handleSubmit(console.log)} className="grid gap-4">
			<InputFormField control={control} name="name" label="Name" />
			<DateFormField control={control} name="birthDate" label="Birth date" />
			<button type="submit">Submit</button>
		</form>
	)
}
```

## Available Exports

### Components

- `RippledButton`
- `AutoComplete`
- `BreadCrumbs`
- `DateRange`
- `Modal`
- `NumericInput`
- `ScrollShadow`
- `SearchInputField`
- `Tabs`
- `DataTable`
- `DataTablePagination`
- `RenderEmptyDataTable`
- `RenderActionDataTableValue`
- `RenderCurrencyDataTableValue`
- `RenderDateRangeDataTableValue`
- `RenderDateTimeDataTableValue`

### Form Components

- `FormField`
- `FormFieldErrorMessage`
- `AutoCompleteFormField`
- `DateFormField`
- `DateRangeFormField`
- `InputFormField`
- `NumberInputFormField`

### Hooks

- `usePagination`
- `usePaginationLocalCalculator`
- `useExcelReader`

### Utilities

- `toMoment`
- `toDefaultValue`
- `acceptFiles`
- `getMimeByFileName`
- `toFailedZodResponse`
- `toSuccessAxiosResponse`
- `toFailedAxiosResponse`
- `getErrorMessage`
- `toastException`
- `toastSuccess`
- `localApi`
- `server_createApiInstanceAsync`

## Package Entry Points

- `sharpcodes-heroui`

## Build

```bash
npm run build
```

Build output is written to `dist/` and includes:

- `dist/index.js`
- `dist/index.d.ts`

## Requirements

- Node.js `>= 22`
- React `^19`
- HeroUI `^3`

## Notes

- The package is ESM-based.
- Styles are shipped separately so consumers can import them explicitly.
- Date helpers use the `Asia/Manila` timezone via `moment-timezone`.
