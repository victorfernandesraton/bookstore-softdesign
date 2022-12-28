import { User } from "../common/entities/user"
import { UseCase } from "../common/usecase"
import { InvalidMailError } from "./error/InvalidMailError"
import { InvalidPasswordLengthError } from "./error/IvalidPasswordLengthError"
import { UserAlreadyExistsError } from "./error/UserAlredyExistError"

const EMAIL_REGEX = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$/

type CreateUserCommandParams = {
	email: string
	password: string
}

export interface UserRepository {
	findByMail(email: string): Promise<User>
	save(user: User): Promise<void>
}

export class CreateUserCommand implements UseCase<CreateUserCommandParams, User> {
	constructor(private readonly userRepository: UserRepository) {}

	async execute({email, password}: CreateUserCommandParams): Promise<User> {
		if (password.length < 6) {
			throw new InvalidPasswordLengthError()
		}

		if (!EMAIL_REGEX.test(email)) {
			throw new InvalidMailError()
		}

		const data = await this.userRepository.findByMail(email)

		if (data) {
			throw new UserAlreadyExistsError()
		}

		const user = User.create({
			email,
			password
		})

		await this.userRepository.save(user)

		return user
	}
}