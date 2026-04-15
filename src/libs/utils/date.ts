import moment from "moment"
import momentTz from "moment-timezone"

// prettier-ignore
export const toMoment = (...params: Parameters<typeof moment>): ReturnType<typeof moment> => {
  return momentTz(...params).tz("Asia/Manila")
}
