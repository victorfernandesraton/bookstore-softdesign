import { User } from "../../common/entities/user"

type UserJSON = {
	email: string
	id: string
}
export function UserToJSON(user: User): UserJSON {
	return {
		email: user.email,
		id: user.id.value
	}
}