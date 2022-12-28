import { FastifyInstance, FastifyPluginAsync, FastifyRequest } from "fastify"
import fp from "fastify-plugin"
import { CreateUserCommand } from "../../commands/createUser"
import { InvalidMailError } from "../../commands/error/InvalidMailError"
import { InvalidPasswordLengthError } from "../../commands/error/IvalidPasswordLengthError"
import { UserAlreadyExistsError } from "../../commands/error/UserAlredyExistError"
import { UserNotFoundError } from "../../common/error/UserNotFoundError"
import { UserDocument, UserRepository } from "../../infra/mongodb/UserRepository"
import { LoginUserQuery } from "../../query/loginUser"
import { UserToJSON } from "../adapter/User"

type AuthSignBody = {
	email: string
	password: string
}

const authRoute: FastifyPluginAsync = async (server: FastifyInstance) => {

	const db = server.mongo.client.db("mydb")
	const userCollection = db.collection<UserDocument>("user")

	const userRepository = new UserRepository(userCollection)

	const createUserCommand = new CreateUserCommand(userRepository)
	const loginUserQuery = new LoginUserQuery(userRepository)

	server.post("/signup", async (req: FastifyRequest<{
		Body: AuthSignBody
	}>, res) => {
		const { email, password } = req.body

		try {

			const user = await createUserCommand.execute({
				email,
				password
			})

			const token = server.jwt.sign({
				user
			})

			res.code(201).send({
				user: UserToJSON(user), token
			})
		} catch (error) {
			switch (true) {
			case error instanceof InvalidPasswordLengthError:
			case error instanceof InvalidMailError:
				res.code(400).send(error)
				throw error
			case error instanceof UserAlreadyExistsError:
				res.code(409)
				throw error
			default:
				res.code(500).send(error)
			}
		}
	})

	server.post("/signin", async (req: FastifyRequest<{
		Body: AuthSignBody
	}>, res) => {
		const { email, password } = req.body

		try {
			const user = await loginUserQuery.execute({email, password})

			const token = server.jwt.sign({
				user
			})

			res.code(201).send({
				user: UserToJSON(user), token
			})

		} catch (error) {
			switch (true) {
			case error instanceof UserNotFoundError:
				res.code(404).send(error)
				throw error
			default:
				res.code(500).send(error)
			}
		}
	})
}

export default fp(authRoute)