import { FastifyInstance, FastifyPluginAsync, FastifyRequest } from "fastify"
import fp from "fastify-plugin"

import { User } from "../../common/entities/user"

type AuthSignBody = {
	email: string
	password: string
}

const authRoute: FastifyPluginAsync = async (server: FastifyInstance) => {
	// TODO: create user in database
	server.post("/signup", (req: FastifyRequest<{
		Body: AuthSignBody
	}>, res) => {
		const { email, password } = req.body
		const user = User.create({
			email, password
		})

		const token = server.jwt.sign({
			user
		})

		res.code(201).send({
			user, token
		})
	})
	// TODO: find user in database

	server.post("/signin", (req: FastifyRequest<{
		Body: AuthSignBody
	}>, res) => {
		const { email, password } = req.body
		const user = User.create({
			email, password
		})

		const token = server.jwt.sign({
			user
		})

		res.code(201).send({
			user, token
		})
	})
}

export default fp(authRoute)