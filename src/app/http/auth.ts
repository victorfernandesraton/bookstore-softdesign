import { FastifyInstance, FastifyPluginAsync, FastifyReply, FastifyRequest } from "fastify"
import fp from "fastify-plugin"
import { CreateUserCommand } from "../../commands/createUser"
import { InvalidMailError } from "../../commands/error/invalidMailError"
import { InvalidPasswordLengthError } from "../../commands/error/invalidPasswordLengthError"
import { UserAlreadyExistsError } from "../../commands/error/userAlredyExistError"
import { UserNotFoundError } from "../../common/error/userNotFoundError"
import { UserDocument, UserRepository } from "../../infra/mongodb/userRepository"
import { GetUserByIdQuery } from "../../query/mongodb/getUserByIdQuery"
import { LoginUserQuery } from "../../query/mongodb/loginUser"
import { UserToJSON, UserToJWT } from "../adapter/user"
import { NotAuthorizedError } from "./error/notAuthorizedError"

type AuthSignBody = {
	email: string
	password: string
}

const authRoute: FastifyPluginAsync = async (fastify: FastifyInstance) => {

	const db = fastify.mongo.client.db("mydb")
	const userCollection = db.collection<UserDocument>("user")

	const userRepository = new UserRepository(userCollection)

	const createUserCommand = new CreateUserCommand(userRepository)
	const loginUserQuery = new LoginUserQuery(userRepository)
	const getUserByIdQuery = new GetUserByIdQuery(userRepository)

	fastify.decorate("auth", async (req: FastifyRequest, res: FastifyReply) => {
		try {
			const basicAuth = req.headers.authorization
			if (!basicAuth) {
				throw new NotAuthorizedError()
			}
			const token = basicAuth.replace("Bearer ", "")

			fastify.jwt.verify(token, {
				maxAge: 60 * 60 * 24 * 3
			})

			const decodedToken = fastify.jwt.decode<{
				id: string,
				email: string
			}>(token)

			if (!decodedToken) {
				throw new NotAuthorizedError()
			}

			const user = await getUserByIdQuery.execute({ id: decodedToken?.id })

			if (!user) {
				throw new NotAuthorizedError()
			}

			req.user = JSON.stringify({
				id: user.id.value,
				email: user.email
			})

		} catch (error) {
			res.code(401).send()
		}
	})

	fastify.post("/signup", async (req: FastifyRequest<{
		Body: AuthSignBody
	}>, res: FastifyReply) => {
		const { email, password } = req.body

		try {

			const user = await createUserCommand.execute({
				email,
				password
			})

			const token = fastify.jwt.sign(UserToJWT(user))

			res.code(201).send({
				user: UserToJSON(user), token
			})
		} catch (error) {
			switch (true) {
			case error instanceof InvalidPasswordLengthError:
			case error instanceof InvalidMailError:
				res.code(400).send({error})
				return
			case error instanceof UserAlreadyExistsError:
				res.code(409)
				return
			default:
				res.code(500).send({error})
			}
		}
	})

	fastify.post("/signin", async (req: FastifyRequest<{
		Body: AuthSignBody
	}>, res) => {
		const { email, password } = req.body

		try {
			const user = await loginUserQuery.execute({ email, password })

			const token = fastify.jwt.sign(UserToJWT(user))

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