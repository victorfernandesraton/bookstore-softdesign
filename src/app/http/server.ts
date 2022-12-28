import fastify from "fastify"

export const server = fastify({
	logger: true,
})

server.get("/health", (_req, res) => {
	res.code(200).send("8-)")
})

