import { Collection } from "mongodb"
import { Book } from "../../common/entities/book"

export type BookDocument = {
	title: string
	description?: string
	author: string
	publisher: string
	publisherAt: Date
	ISBN: string
}
export class BookRepository {
	constructor(private readonly collection: Collection<BookDocument>) { }
	async findByISBN(code: string): Promise<Book[]> {
		const books = await this.collection.find({
			ISBN: code
		}).toArray()

		return books.map((book) => Book.create({
			...book,
			id: book._id.toString(),
		}))
	}

	async save(book: Book): Promise<void> {
		await this.collection.insertOne({
			...book,
			ISBN: book.getISBN,
		})
	}
}