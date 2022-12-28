import { Collection } from "mongodb"
import { User } from "../../common/entities/user"
import { UserNotFoundError } from "./error/UserNotFoundError"

type UserDocument = {
	email: string
	password: string
	salt: string
	id: string
}

export class UserRepository {
	constructor(private readonly collection: Collection<UserDocument>) {

	}

	async findByMail(email: string): Promise<User> {
		const data = await this.collection.findOne({
			email
		})

		if (data) {
			return User.create(data)
		}

		throw new UserNotFoundError()
	}

	async save(user: User): Promise<void> {
		await this.collection.insertOne({
			email: user.email,
			id: user.id.value,
			password: user.getPassword,
			salt: user.salt,
		})
	}
}