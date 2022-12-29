import { Collection, Document, ObjectId } from "mongodb"
import { Book } from "../../common/entities/book"
import { BookCopy } from "../../common/entities/bookCopy"
import { BookNotFoundError } from "../../common/error/bookNotFoundError"
import { UseCase } from "../../common/usecase"
import { BookCopyDocument } from "../../infra/mongodb/bookCopyRepository"
import { BookDocument } from "../../infra/mongodb/bookRepository"


type BookDetailsDocument = BookDocument & {
	copies: BookCopyDocument[]
	_id: ObjectId
}

type GetOneBookInfoQueryParams = {
	id: string
}

type GetOneBookInfoQueryResult = {
	book: Book,
	copies: BookCopy[]
}

export class GetOneBookInfoQuery implements UseCase<GetOneBookInfoQueryParams, GetOneBookInfoQueryResult> {

	constructor(private readonly bookCollection: Collection<BookDocument>) { }

	async execute(params: GetOneBookInfoQueryParams): Promise<GetOneBookInfoQueryResult> {

		const id = new ObjectId(params.id)
		const hasBook = await this.bookCollection.findOne({
			_id: id,
			status: { "$ne": 0 }
		})

		if (!hasBook) {
			throw new BookNotFoundError()
		}

		const [data] = await this.bookCollection.aggregate<BookDetailsDocument>([
			{
				"$match": { _id: id }
			},
			{
				"$lookup": {
					from: "bookCopy",
					localField: "_id",
					foreignField: "bookId",
					as: "copies"
				}
			}
		]).toArray()

		const { copies, ...book } = data
		return {
			book: Book.create({
				...book,
				id: book._id.toString()
			}),
			copies: copies.map((item: Document) => BookCopy.create({
				bookId: item.bookId.toString(),
				status: item.status,
				id: item._id.toString(),
				userId: item.userId ? item.userId.toString() : undefined
			}))
		}
	}
}