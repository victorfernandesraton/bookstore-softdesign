import { server } from "./server"
import * as dotenv from "dotenv"


const start = async () => {
	try {
		dotenv.config()
		await server.listen({
			host: "0.0.0.0",
			port: 3000,
		})
		console.log("Server started successfully")
	} catch (err) {
		server.log.error(err)
		process.exit(1)
	}
}
start()