import { server } from "./server"

const start = async () => {
	try {
		await server.listen(process.env.PORT || 3000)
		console.log("Server started successfully")
	} catch (err) {
		server.log.error(err)
		process.exit(1)
	}
}
start()