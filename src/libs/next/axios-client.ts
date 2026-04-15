import axios from "axios"

const local = axios.create({ baseURL: "/api" })

// local.interceptors.response.use(
// 	(response) => response,
// 	(error) => {
// 		// const callback = window.location.pathname + window.location.search
// 		// if (axios.isAxiosError(error)) {
// 		// 	switch (error.status) {
// 		// 		case 401: {
// 		// 			window.location.href = `/login?${process.env.NEXT_PUBLIC_CALLBACK_URL_KEY}=${encodeURIComponent(callback)}`
// 		// 			return
// 		// 		}
// 		// 	}
// 		// }

// 		throw error
// 	},
// )

export { local as localApi }
