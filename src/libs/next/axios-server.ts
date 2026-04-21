"use server"

import _ from "lodash"
import axios, { CreateAxiosDefaults } from "axios"
import { PaginatedResponse, Res } from "../../types/common"

// prettier-ignore
export const server_createApiInstanceAsync = async <T extends never> (accessToken: string, config?: Partial<CreateAxiosDefaults<T>>) => {
  const instance = axios.create(
    _.merge({}, {
        headers: {
          Authorization: accessToken ? [ "Bearer", accessToken ].join(" ") : undefined
        }
      }, 
      config
    )
  )
  instance.interceptors.response.use(
    (response) => {
      if(response.config.responseType === "arraybuffer") return response
      
      const data = response.data


      if(data?.IsSuccess) {
        
        if(_.isArray(data.Result?.Items))
          return {
            ...response,
            data: { 
              ok: true, 
              message: data.Message,
              result: {
                canNext: data.Result.HasNext,
                canPrev: data.Result.HasPrev,
                items: data.Result.Items,
                totalPages: data.Result.TotalPages
              }
            } as PaginatedResponse<never>
          }

        return {
          ...response,
          data: {
            ok: true,
            message: data.Message,
            result: data.Result
          } as Res<never>
        }
      }
      
      return {
        ...response,
        data: {
          ok: true,
          message: "Success",
          result: data
        } as Res<never>
      }

    }, 
    // () => {}
  )
  return instance
}
