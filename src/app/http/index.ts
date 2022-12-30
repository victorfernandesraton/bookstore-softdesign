import config from "../config"
import auth from "./auth"
import books from "./books"
import server from "./server"

declare module "fastify" {
	interface FastifyInstance {
		auth: (req: FastifyRequest, res: FastifyReply) => void
	}
}

const start = async () => {
	try {

		await server.register(auth)
		await server.register(books)

		server.get("/health", (_req, res) => {
			res.code(200).send("8-)")
		})

		await server.listen({
			...config.server
		})
	} catch (err) {
		server.log.error(err)
		process.exit(1)
	}
}
start()