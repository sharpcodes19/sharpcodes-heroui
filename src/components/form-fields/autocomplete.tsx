"use client"

import _ from "lodash"
import { FieldValues, Path } from "react-hook-form"
import {
	Autocomplete,
	AutocompleteFilterProps,
	AutocompletePopoverProps,
	AutocompleteProps,
	AutocompleteTriggerProps,
	AutocompleteValueProps,
	cn,
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
import { FormField, TFormField } from "./field"

// prettier-ignore
type TAutoCompleteFormField <D extends FieldValues, T extends FieldValues, K extends Path<T>> = {
  isMultiSelection?: boolean
  items: Array<D>
  idKey: Path<D>
  nameKey: Path<D>
  label?: string
  emptyMessage?: string
} & TFormField<T, K>
  & WithProperties<{
    base?: {
      autoComplete?: Omit<AutocompleteProps<D>, "selectionMode">
      trigger?: AutocompleteTriggerProps
      value?: AutocompleteValueProps
    }
    tag?: {
      group?: Omit<TagGroupProps, "onRemove">
      list?: TagGroupListProps<D>
      item?: TagRootProps
    }
    popover?: {
      popover?: Partial<AutocompletePopoverProps>
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
      listbox?: Omit<ListBoxRootProps<D>, "items" | "renderEmptyState">
      empty?: EmptyStateProps
      item?: Omit<ListBoxItemProps, "id" | "textValue">
      check?: ListBoxItemIndicatorProps
    }
    label?: LabelProps
    error?: FieldErrorProps
  }>

// prettier-ignore
export const AutoCompleteFormField = <D extends FieldValues, T extends FieldValues, K extends Path<T>> ({ isMultiSelection, emptyMessage, items, idKey, nameKey, properties, label, ...form }: TAutoCompleteFormField<D, T, K>) => {
  const { contains } = useFilter({ sensitivity: "base" })

  // const isSingle = properties?.base?.autoComplete?.selectionMode === "single"

  return <FormField { ...form }>
    {
      ({ field: { value, onChange, ...field }, fieldState }) => {

        // @ts-expect-error keys
        return <Autocomplete
          isInvalid={fieldState.invalid}
          selectionMode={isMultiSelection ? "multiple" : "single"}
          variant="secondary"
          value={ 
            !isMultiSelection ? value :
            !value ? undefined : _.isArray (value) ? value : [ value ]
          }
          { ...properties?.base?.autoComplete }
          { ...field }
          onChange={
            (keys) => {
              if(!isMultiSelection)
                return onChange(keys)

              if(!_.isArray(keys)) 
                return onChange([])

              return onChange(keys)
            }
          }
        >
          <Label { ...properties?.label }>{ label }</Label>
          <Autocomplete.Trigger { ...properties?.base?.trigger } className={cn("py-0 items-center", properties?.base?.trigger?.className)}>
            <Autocomplete.Value { ...properties?.base?.value }>
              {
                ({ defaultChildren, isPlaceholder, state }) => {

                  if(isPlaceholder || !state.selectedItems.length)
                    return defaultChildren

                  const selectedItemKeys = state.selectedItems.map((item) => item.key)

                  return <TagGroup
                    size="lg"
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

                          return <Tag key={current.id} id={current.id} { ...properties?.tag?.item } 
                            className={
                              cn(
                                !isMultiSelection ? "[&_.close-button]:hidden" : undefined,
                                "bg-transparent!",
                                properties?.tag?.item?.className
                              )
                            }
                            textValue={current.name}
                          >
                            <span>{ current.name }</span>
                          </Tag>
                        })
                      }
                    </TagGroup.List>
                  </TagGroup>

                }
              }
            </Autocomplete.Value>
            <Autocomplete.Indicator />
          </Autocomplete.Trigger>
          <Autocomplete.Popover isNonModal placement="bottom left" { ...properties?.popover?.popover }>
            <Autocomplete.Filter filter={contains} { ...properties?.popover?.filter }>
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
            </Autocomplete.Filter>
          </Autocomplete.Popover>
          {/* <FormFieldErrorMessage fieldState={fieldState} properties={{ error: properties?.error }} /> */}
        </Autocomplete>
      }
    }
  </FormField>

}
