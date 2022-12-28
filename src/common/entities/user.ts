import { UUID } from "../uuid"
import {randomBytes, pbkdf2Sync} from "node:crypto"
type UserFactoryParams = {
	id?: string
	email: string
	password: string
	salt?: string
}

export class User {

	constructor(
		readonly id: UUID,
		public email: string,
		private password: string,
		readonly salt: string,
	) {}

	static create(params: UserFactoryParams): User {
		if (!params.salt) {
			params.salt = User.generateSalt()
			params.password = User.hashPassword(params.password, params.salt)
		}

		return new User(UUID.create(params.id), params.email, params.password, params.salt)
	}

	static generateSalt(): string {
		const salt = randomBytes(16).toString("hex")
		return salt
	}
	static  hashPassword(password: string, salt: string): string {
		const hash = pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex")
		return hash
	}

	isEqualPassword(password: string): boolean {
		return this.password === User.hashPassword(password, this.salt)
	}

	updatePassword(password: string) {
		this.password = User.hashPassword(password, this.salt)
	}
	get getPassword(): string {
		return this.password
	}
}