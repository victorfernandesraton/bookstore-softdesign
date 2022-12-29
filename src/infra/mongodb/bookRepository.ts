import { Collection, ObjectId } from "mongodb"
import { Book } from "../../common/entities/book"
import { BookNotFoundError } from "../../common/error/bookNotFoundError"

export type BookDocument = {
	title: string
	description?: string
	author: string
	publisher: string
	publisherAt: Date
	ISBN: string
	status: number
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

	async findById(id: string): Promise<Book> {
		const book = await this.collection.findOne({
			_id: new ObjectId(id)
		})

		if (!book || book.status === 0) {
			throw new BookNotFoundError()
		}

		return Book.create({
			...book,
			id: book._id.toString(),
		})
	}

	async update(book: Book): Promise<void> {
		const { id, ...restBook } = book
		await this.collection.updateOne({
			_id: new ObjectId(id.value)
		}, {
			"$set": {
				...restBook
			}
		}, {
			upsert: false
		})
	}

	async delete(id: string): Promise<void> {
		await this.collection.updateOne({
			_id: new ObjectId(id)
		}, {
			status: 0
		})
	}

	async save(book: Book): Promise<void> {
		await this.collection.insertOne({
			...book,
			ISBN: book.getISBN,
			status: 1
		})
	}
}