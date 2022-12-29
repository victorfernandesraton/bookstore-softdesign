import { User } from "../common/entities/user"
import { UserNotFoundError } from "../common/error/userNotFoundError"
import { UseCase } from "../common/usecase"

type LoginUserQueryParams = {
	email: string
	password: string
}

interface UserRepository {
	findByMail(email: string): Promise<User>
}
export class LoginUserQuery implements UseCase<LoginUserQueryParams, User> {
	constructor(private readonly userRepository: UserRepository) {}

	async execute({email, password}: LoginUserQueryParams): Promise<User> {
		const user = await this.userRepository.findByMail(email)

		if (!user.isEqualPassword(password)) {
			throw new UserNotFoundError()
		}

		return user
	}
}