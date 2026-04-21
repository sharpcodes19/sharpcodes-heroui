"use client"

import _ from "lodash"
import {
	cn,
	Tabs as HeroUITabs,
	LinkProps,
	TabIndicatorProps,
	TabListContainerProps,
	TabListProps,
	TabPanelProps,
	TabProps,
	TabsProps
} from "@heroui/react"
import { ReactNode, useMemo } from "react"
import { WithProperties } from "../../types/properties"

// prettier-ignore
type TTabs<T extends string, K extends T = T> = {
  pathname: string
  renderTab?: {
    [P in K]: ReactNode
  }
  data: {
    [P in K]: Partial<
      Pick<LinkProps, "href"> & 
      {
        component?: ReactNode
      }
    >
  }
} & WithProperties<{
  tab?: Omit<TabProps, "id" | "href" | "render">
  panel?: Omit<TabPanelProps, "id">
  tabs?: TabsProps
  list?: TabListProps
  indicator?: TabIndicatorProps
  listContainer?: TabListContainerProps
}>

// prettier-ignore
export const Tabs = <T extends string, K extends T = T> ({ pathname, renderTab, data, properties }: TTabs<T, K>) => {
  
  const activeKey = useMemo(() => {
    const paths = pathname.split("/")
    const path = paths[paths.length - 1]

    const activeKey = Object.keys(data).find((key) => {
      const item = _.get(data, key)
      if(item.href)
        return item.href.startsWith(pathname)
      return key.toLowerCase() == path.toLowerCase()
    })
    return activeKey
  }, [ pathname, data ])

  return <HeroUITabs defaultSelectedKey={activeKey} { ...properties?.tabs }>
    <HeroUITabs.ListContainer { ...properties?.listContainer }>
      <HeroUITabs.List aria-label="list options" { ...properties?.list }>
        {
          Object.keys(data).map((k) => {
            const key = k as keyof typeof data

            const { href } = data[key]
            return <HeroUITabs.Tab 
              key={key}
              id={key}
              href={href}
              { ...properties?.tab }
              className={cn("w-fit", properties?.tab?.className)}
            >
              { renderTab?.[key] ?? key }
              <HeroUITabs.Indicator { ...properties?.indicator } />
            </HeroUITabs.Tab>

          })
        }
      </HeroUITabs.List>
    </HeroUITabs.ListContainer>
    {
      Object.keys(data).map((key) => {
        const { component } = data[key as keyof typeof data]

        return <HeroUITabs.Panel key={key} id={key} { ...properties?.panel }>
          { component }
        </HeroUITabs.Panel>

      })
    }

  </HeroUITabs>

}
