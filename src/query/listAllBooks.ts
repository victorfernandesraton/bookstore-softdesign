import { Collection, Filter } from "mongodb"
import { Book } from "../common/entities/book"
import { Paginated } from "../common/paginated"
import { UseCase } from "../common/usecase"
import { BookDocument } from "../infra/mongodb/bookRepository"

type ListAllBooksQueryParams = {
	query?: string
	limit?: number
	offset?: number
}

export class ListAllBooksQuery implements UseCase<ListAllBooksQueryParams, Paginated<Book>> {

	constructor(private readonly collection: Collection<BookDocument>) { }

	async execute({
		query,
		limit = 5,
		offset = 0,

	}: ListAllBooksQueryParams): Promise<Paginated<Book>> {


		const fields = ["title", "description", "ISBN", "publisher", "author"]
		let match: Filter<BookDocument> = {
			status: {"$ne": 0}
		}

		if (query) {
			match = {
				"$or": [fields.map(item => ({
					[item]: {
						"$regex": query, "$options": "i"
					}
				}))]
			}
		}

		const cursor = this.collection.find(match).limit(limit).skip(offset * limit)
		const [result, total] = await Promise.all([cursor.toArray(), cursor.count()])

		return {
			data: result.map(item => Book.create({
				...item,
				id: item._id.toString()
			})),
			limit: limit,
			offset: offset,
			total,
		}
	}

}