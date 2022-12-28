import fastifyJwt from "@fastify/jwt"
import fastifyMongodb from "@fastify/mongodb"
import fastify from "fastify"
import dotenv from "dotenv"

import auth from "./auth"
import config from "../config"

export const server = fastify({
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

server.register(auth)

server.get("/health", (_req, res) => {
	res.code(200).send("8-)")
})

