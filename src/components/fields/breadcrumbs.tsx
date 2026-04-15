"use client"

import { Breadcrumbs } from "@heroui/react"

// prettier-ignore
export type TBreadCrumb = Omit<Parameters<(typeof Breadcrumbs)["Item"]>[0], "children">

type TBreadCrumbs = {
	data: Record<string, TBreadCrumb> | undefined
}

// prettier-ignore
export const BreadCrumbs = ({ data }: TBreadCrumbs) => {

  return <Breadcrumbs>
    {
      !data ? null :
      Object.keys(data).map((key, index) => {
        const item = data[key as keyof typeof data]
        if(!item) return
        
        return <Breadcrumbs.Item 
          key={index}
          { ...item }
        >
          <span>{ key }</span>
        </Breadcrumbs.Item>
      })
    }
  </Breadcrumbs>

}
