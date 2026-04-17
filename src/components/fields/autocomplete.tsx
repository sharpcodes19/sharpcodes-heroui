"use client"

import _ from "lodash"
import { FieldValues, Path } from "react-hook-form"
import {
	Autocomplete as HeroUIAutoComplete,
	AutocompleteFilterProps,
	AutocompletePopoverProps,
	AutocompleteProps,
	AutocompleteTriggerProps,
	AutocompleteValueProps,
	EmptyState,
	EmptyStateProps,
	FieldErrorProps,
	Label,
	LabelProps,
	ListBox,
	ListBoxItemIndicatorProps,
	ListBoxItemProps,
	ListBoxRootProps,
	SearchField,
	SearchFieldClearButtonProps,
	SearchFieldGroupProps,
	SearchFieldInputProps,
	SearchFieldProps,
	SearchFieldSearchIconProps,
	Tag,
	TagGroup,
	TagGroupListProps,
	TagGroupProps,
	TagRootProps,
	useFilter
} from "@heroui/react"

// prettier-ignore
type TAutoComplete <T extends FieldValues, K extends Path<T>> = {
  items: Array<T>
  idKey: K
  nameKey: Path<T>
  label?: string
  emptyMessage?: string
  onChange: (keys: Array<T[K]>) => void
  value: Array<T[K]>
}
  & WithProperties<{
    base?: {
      autoComplete?: Omit<AutocompleteProps<T>, "onChange" | "value">
      trigger?: AutocompleteTriggerProps
      value?: AutocompleteValueProps
    }
    tag?: {
      group?: Omit<TagGroupProps, "onRemove">
      list?: TagGroupListProps<T>
      item?: TagRootProps
    }
    popover?: {
      popover?: AutocompletePopoverProps
      filter?: Omit<AutocompleteFilterProps, "filter">
    },
    search?: {
      field?: SearchFieldProps
      group?: SearchFieldGroupProps
      icon?: SearchFieldSearchIconProps
      input?: SearchFieldInputProps
      clear?: SearchFieldClearButtonProps
    },
    list?: {
      listbox?: Omit<ListBoxRootProps<T>, "items" | "renderEmptyState">
      empty?: EmptyStateProps
      item?: Omit<ListBoxItemProps, "id" | "textValue">
      check?: ListBoxItemIndicatorProps
    }
    label?: LabelProps
    error?: FieldErrorProps
  }>

// prettier-ignore
export const AutoComplete = <T extends FieldValues, K extends Path<T>> ({ emptyMessage, items, idKey, nameKey, properties, label, onChange, value }: TAutoComplete<T, K>) => {
  const { contains } = useFilter({ sensitivity: "base" })

  const isSingle = properties?.base?.autoComplete?.selectionMode === "single"

  // @ts-expect-error values
  return <HeroUIAutoComplete
    selectionMode="multiple"
    variant="secondary"
    value={ 
      isSingle ? value :
      !value ? undefined : _.isArray (value) ? value : [ value ]
    }
    { ...properties?.base?.autoComplete }
    onChange={
      (keys) => {
        if(isSingle)
          // @ts-expect-error keys
          return onChange(keys)

        if(!_.isArray(keys)) return onChange([])

        // @ts-expect-error keys
        return onChange(keys)
      }
    }
  >
    <Label { ...properties?.label }>{ label }</Label>
    <HeroUIAutoComplete.Trigger { ...properties?.base?.trigger }>
      <HeroUIAutoComplete.Value { ...properties?.base?.value }>
        {
          ({ defaultChildren, isPlaceholder, state }) => {

            if(isPlaceholder || !state.selectedItems.length)
              return defaultChildren

            const selectedItemKeys = state.selectedItems.map((item) => item.key)

            return <TagGroup size="sm" 
              aria-label="autocomplete tags"
              { ...properties?.tag?.group }
              onRemove={(keys) => {
                const keysToRemove = _.toArray(keys)
                const keysCurrent = _.isArray(value) ? value : [ value ]
                return onChange(
                  keysCurrent.filter((key) => 
                    !keysToRemove.includes(key))
                )
              }} 
            >
              <TagGroup.List { ...properties?.tag?.list }>

                {
                  selectedItemKeys.map((selectedItemKey) => {
                    const item = items.find((s) => _.get(s, idKey) == selectedItemKey)
                    if(!item) return null

                    const current = {
                      id: _.get(item, idKey),
                      name: _.get(item, nameKey)
                    }

                    return <Tag key={current.id} id={current.id} { ...properties?.tag?.item }>{ current.name }</Tag>
                  })
                }
              </TagGroup.List>
            </TagGroup>

          }
        }
      </HeroUIAutoComplete.Value>
      <HeroUIAutoComplete.Indicator />
    </HeroUIAutoComplete.Trigger>
    <HeroUIAutoComplete.Popover placement="bottom left" { ...properties?.popover?.popover }>
      <HeroUIAutoComplete.Filter filter={contains} { ...properties?.popover?.filter }>
        <SearchField autoFocus fullWidth aria-label="autocomplete search" name="search" variant="secondary" { ...properties?.search?.field }>
          <SearchField.Group { ...properties?.search?.group }>
            <SearchField.SearchIcon { ...properties?.search?.icon } />
              <SearchField.Input placeholder="Search..." { ...properties?.search?.input } />
              <SearchField.ClearButton { ...properties?.search?.clear } />
            </SearchField.Group>
        </SearchField>
        <ListBox
          renderEmptyState={
            () =>
              <EmptyState { ...properties?.list?.empty }>
                <span>{ emptyMessage || "No results found" }</span>
              </EmptyState>
          }
        >
          {
            items.map((item) => {

              const current = {
                id: _.get(item, idKey),
                name: _.get(item, nameKey)
              }

              return <ListBox.Item 
                id={ current.id } 
                key={ current.id } 
                textValue={ current.name } 
                aria-label={current.name}
                { ...properties?.list?.item }
              >
                <span>{ current.name }</span>
                <ListBox.ItemIndicator { ...properties?.list?.check } />
              </ListBox.Item>

            })
          }
        </ListBox>
      </HeroUIAutoComplete.Filter>
    </HeroUIAutoComplete.Popover>
    {/* <FormFieldErrorMessage fieldState={fieldState} properties={{ error: properties?.error }} /> */}
  </HeroUIAutoComplete>

}
