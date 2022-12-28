import { Collection, ObjectId } from "mongodb"
import { User } from "../../common/entities/user"
import { UserNotFoundError } from "../../common/error/UserNotFoundError"

export type UserDocument = {
	email: string
	password: string
	salt: string
}

export class UserRepository {
	constructor(private readonly collection: Collection<UserDocument>) {

	}

	async findByMail(email: string): Promise<User> {
		const data = await this.collection.findOne({
			email
		})

		if (data) {
			return User.create({ ...data, id: data._id.toString() })
		}

		throw new UserNotFoundError()
	}

	async findById(id: string): Promise<User> {
		const data = await this.collection.findOne({
			_id: new ObjectId(id)
		})

		if (data) {
			return User.create({ ...data, id: data._id.toString() })
		}

		throw new UserNotFoundError()
	}


	async save(user: User): Promise<void> {

		await this.collection.insertOne({
			email: user.email,
			password: user.getPassword,
			salt: user.salt,
		})
	}
}