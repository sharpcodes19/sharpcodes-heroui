import _ from "lodash"
import * as xlsx from "xlsx"
import { FieldValues, Path } from "react-hook-form"

export type TExcelToJsonResult<T extends FieldValues> = {
	headers: Array<{ normalized: Path<T>; original: string }>
	data: Array<T>
	metadata: xlsx.FullProperties | undefined
}

type TUseExcelReader<T extends FieldValues> = {
	headerRowIndex?: number
	rowStartIndex: number

	normalizeKeys: Partial<Record<string, Path<T>>>
	dateKeys?: Array<Path<T>>
}

type VALUES = Date | string | number

// prettier-ignore
export const useExcelReader = <T extends FieldValues>({ normalizeKeys, dateKeys, rowStartIndex, headerRowIndex = 0 }: TUseExcelReader<T>) => {

	const readWithId = (buffer: Buffer) => {
		const result: Record<string, TExcelToJsonResult<T & { _id: string }>> = {}
		const workbook = xlsx.read(buffer, { type: "buffer" })

		for (const sheetName of workbook.SheetNames) {
			const sheet = workbook.Sheets[sheetName]
			const rows = xlsx.utils.sheet_to_json(sheet, {
				header: 1,
				defval: null,
				raw: true,
			}) as Array<Array<unknown>>

			const excelHeaders = rows[headerRowIndex] as Array<string>
			const headers = excelHeaders.map((header) => normalizeKeys[header] || header) as Array<Path<T>>
			
			const data = rows.slice(rowStartIndex).map((row) => {

				const o: Record<string, VALUES> = {}
				headers.forEach((key, index) => {
					let value = row[index] as VALUES | null

					const isDate = dateKeys?.includes(key) && typeof value === "number"
					if(isDate) {
						const parsed = xlsx.SSF.parse_date_code(value)
						if(parsed)
							value = new Date(parsed.y, parsed.m - 1, parsed.d)
					}

					o[key] = value as VALUES
				})

				return {
					...o,
					_id: crypto.randomUUID()
				}
			})
				.filter((row) => Object.values(row).some((v) => !_.isNil(v)))

			result[ sheetName ] = {
				// @ts-expect-error data
				data,
				// @ts-expect-error Path<T>
				headers: headers.map((normalized, index) => ({
					normalized,
					original: excelHeaders[index]
				})),
				metadata: workbook.Props
			}
		}

		return result
	}

  return { readWithId }
}
