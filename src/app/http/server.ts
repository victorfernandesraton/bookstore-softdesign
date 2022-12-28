import fastify from "fastify"
import fastifyJwt from "@fastify/jwt"
import auth from "./auth"
export const server = fastify({
	logger: true,
})

server.register(fastifyJwt, {
	secret: "mySecret",
})

server.register(auth)

server.get("/health", (_req, res) => {
	res.code(200).send("8-)")
})

