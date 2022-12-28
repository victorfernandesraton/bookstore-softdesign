import { User } from "../../common/entities/user"

type UserJSON = {
	email: string
	id: string
}

type UserJWT = UserJSON;
export function UserToJSON(user: User): UserJSON {
	return {
		email: user.email,
		id: user.id.value
	}
}

export function UserToJWT(user: User): UserJWT {
	return {
		email: user.email,
		id: user.id.value
	}
}