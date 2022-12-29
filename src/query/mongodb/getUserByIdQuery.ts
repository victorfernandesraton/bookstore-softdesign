import { User } from "../../common/entities/user"
import { UseCase } from "../../common/usecase"

type GetUserByIdQueryParams = {
	id: string
}
interface UserRepository {
	findById(id: string): Promise<User>
}
export class GetUserByIdQuery implements UseCase<GetUserByIdQueryParams, User> {
	constructor(private readonly userRepository: UserRepository) { }

	async execute({ id }: GetUserByIdQueryParams): Promise<User> {
		const user = await this.userRepository.findById(id)

		return user
	}
}