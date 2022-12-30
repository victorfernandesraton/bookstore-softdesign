import { Collection, ObjectId } from "mongodb"
import { User } from "../../common/entities/user"
import { UserNotFoundError } from "../../common/error/userNotFoundError"
import { UseCase } from "../../common/usecase"
import { BookCopyDocument } from "../../infra/mongodb/bookCopyRepository"
import { BookDocument } from "../../infra/mongodb/bookRepository"
import { UserDocument } from "../../infra/mongodb/userRepository"


type BookItem = BookDocument & {_id: string}
type BookCopyDetails = BookCopyDocument & {
	_id: ObjectId,
	book: BookItem[]
}

type GetBooksForUserQueryParams = {
	userId: string
}

type GetBooksForUserQueryResult = {
	user: User,
	copies: BookCopyDetails[]
}

export class GetBooksForUserQuery implements UseCase<GetBooksForUserQueryParams, GetBooksForUserQueryResult> {

	constructor(
		private readonly bookCopyCollection: Collection<BookCopyDocument>,
		private readonly userCollection: Collection<UserDocument>
	) { }

	async execute(params: GetBooksForUserQueryParams): Promise<GetBooksForUserQueryResult> {

		const id = new ObjectId(params.userId)
		const user = await this.userCollection.findOne({
			_id: id,
		})

		if (!user) {
			throw new UserNotFoundError()
		}

		const data = await this.bookCopyCollection.aggregate<BookCopyDetails>([
			{
				"$match": { userId: id }
			},
			{
				"$lookup": {
					from: "book",
					localField: "bookId",
					foreignField: "_id",
					as: "book"
				}
			}
		]).toArray()

		return {
			user: User.create({
				id: user._id.toString(),
				...user
			}),
			copies: data
		}
	}
}