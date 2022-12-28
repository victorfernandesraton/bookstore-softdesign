import fastifyJwt from "@fastify/jwt"
import fastifyMongodb from "@fastify/mongodb"
import fastify from "fastify"
import config from "../config"

const server = fastify({
	trustProxy: true,
	logger: true,
})


server.register(fastifyMongodb, {
	forceClose: true,
	url: config.mongodb.host
})

server.register(fastifyJwt, {
	secret: "mySecret",

})

export default server
