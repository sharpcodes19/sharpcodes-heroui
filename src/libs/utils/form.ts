import _ from "lodash"
import z from "zod"
import mime from "mime"
import { FieldValues, Path } from "react-hook-form"

// prettier-ignore
export const toDefaultValue = <T extends FieldValues> (schema: z.ZodType<T>) => {
  const result = {} as T

  const walk = (current: z.ZodType, path: Array<string> = []) => {
    if(current instanceof z.ZodObject) {
      const shape = current.shape
      
      Object.entries(shape).forEach(([ key, value ]) => {
        walk(value, [ ...path, key ])
      })

      return
    }

    if(current instanceof z.ZodArray) {
      _.set(result, path.join(".") as Path<T>, [])
      return
    }

    if(current instanceof z.ZodString) {
      _.set(result, path.join(".") as Path<T>, "")
      return
    }

    _.set(result, path.join(".") as Path<T>, undefined)
  }

  walk(schema)

  return result
}

// prettier-ignore
export const acceptFiles = {
  excel: {
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
    "application/vnd.ms-excel": [".xls"],
  },
  pdf: {
    "application/pdf": [".pdf"]
  },
  images: {
    "image/jpeg": [".jpg", ".jpeg"],
    "image/png": [".png"]
  }
}

export const getMimeByFileName = (fileName: string) => mime.getType(fileName)
