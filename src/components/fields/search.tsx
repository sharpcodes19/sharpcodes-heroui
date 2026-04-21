"use client"

import {
	cn,
	Label,
	LabelProps,
	SearchField,
	SearchFieldClearButtonProps,
	SearchFieldGroupProps,
	SearchFieldInputProps,
	SearchFieldProps,
	SearchFieldSearchIconProps
} from "@heroui/react"
import { useEffect, useState } from "react"
import { useDebounce } from "react-haiku"
import { WithProperties } from "../../types/properties"

type SearchInputField = {
	delay?: number
	label?: string
	onDebounce?: (value: string) => void
} & WithProperties<{
	field?: Omit<SearchFieldProps, "value" | "onChange">
	group?: SearchFieldGroupProps
	icon?: SearchFieldSearchIconProps
	input?: SearchFieldInputProps
	clear?: SearchFieldClearButtonProps
	label?: LabelProps
}>

// prettier-ignore
export const SearchInputField = ({ label, delay, onDebounce, properties }: SearchInputField) => {
	const [text, setText] = useState<string>("")
	const debounced = useDebounce(text, delay || 300)

	useEffect(() => {

		onDebounce?.(debounced)

	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [debounced])

  return <SearchField 
    variant="secondary" 
    aria-label="search for keyword" 
    { ...properties?.field }
    value={text}
    onChange={setText}
  >
		<Label { ...properties?.label }>{ label }</Label>
    <SearchField.Group { ...properties?.group }>
      <SearchField.SearchIcon { ...properties?.icon } />
      <SearchField.Input placeholder="Search..." { ...properties?.input } className={cn("w-70", properties?.input?.className)} />
      <SearchField.ClearButton { ...properties?.clear } />
    </SearchField.Group>
  </SearchField>

}
