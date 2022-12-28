import { server } from "./server"
import config from "../config"



const start = async () => {
	try {
		await server.listen({
			...config.server
		})
	} catch (err) {
		server.log.error(err)
		process.exit(1)
	}
}
start()