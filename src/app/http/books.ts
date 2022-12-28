import { FastifyInstance, FastifyPluginAsync } from "fastify"
import fp from "fastify-plugin"

const bookRoute: FastifyPluginAsync = async (fastify: FastifyInstance) => {
	fastify.get("/books", {
		preHandler: [fastify.auth]
	}, (req, res) => {
		res.code(200).send()
	})
}

export default fp(bookRoute)