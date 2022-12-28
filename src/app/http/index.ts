import { server } from "./server"
import * as dotenv from "dotenv"


const start = async () => {
	try {
		dotenv.config()
		await server.listen({
			host: "0.0.0.0",
			port: process.env.PORT ? parseInt(process.env.PORT, 10) :3000,
		})
		console.log("Server started successfully")
	} catch (err) {
		server.log.error(err)
		process.exit(1)
	}
}
start()