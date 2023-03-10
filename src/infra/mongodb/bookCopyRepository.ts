import { Collection, ObjectId } from "mongodb"
import { BookCopy, BookCopyStatusEnum } from "../../common/entities/bookCopy"
import { BookCopyNotFoundError } from "../../common/error/bookCopyNotFoundError"
import { BookNotAvaliableToBorrowError } from "../../common/error/bookNotAvaliableToBorrowError"

export type BookCopyDocument = {
	bookId: ObjectId,
	status: BookCopyStatusEnum,
	userId?: ObjectId,
}

export class BookCopyRepository {
	constructor(private readonly collection: Collection<BookCopyDocument>) { }

	async save(book: BookCopy): Promise<void> {
		await this.collection.insertOne({
			...book,
			bookId: new ObjectId(book.bookId.value),
			userId: book.getUserId ? new ObjectId(book.getUserId.value) : undefined
		})
	}

	async findInBorrowByBook(bookId: string): Promise<BookCopy[]> {
		const data = await this.collection.find({
			bookId: new ObjectId(bookId),
			status: BookCopyStatusEnum.BORROW
		}).toArray()

		return data.map(bookCopy =>
			BookCopy.create({
				...bookCopy,
				id: new ObjectId(bookCopy._id).toString(),
				bookId: new ObjectId(bookCopy.bookId).toString(),
				userId: bookCopy.userId ? new ObjectId(bookCopy.userId).toString() : undefined,
				status: bookCopy.status
			}))
	}

	async findAvaliableCopy(bookId: string): Promise<BookCopy> {
		const data = await this.collection.findOne({
			bookId: new ObjectId(bookId),
			status: BookCopyStatusEnum.AVALIABLE
		})

		if (!data) {
			throw new BookNotAvaliableToBorrowError()
		}

		return BookCopy.create({
			...data,
			id: new ObjectId(data._id).toString(),
			bookId: new ObjectId(data.bookId).toString(),
			userId: data.userId ? new ObjectId(data.userId).toString() : undefined,
			status: data.status
		})
	}

	async findById(id: string): Promise<BookCopy> {
		console.log(id)
		const data = await this.collection.findOne({
			_id: new ObjectId(id),
		})

		if (!data) {
			throw new BookCopyNotFoundError()
		}

		return BookCopy.create({
			...data,
			id: new ObjectId(data._id).toString(),
			bookId: new ObjectId(data.bookId).toString(),
			userId: data.userId ? new ObjectId(data.userId).toString() : undefined,
			status: data.status
		})
	}
	async update(bookCopy: BookCopy): Promise<void> {
		const { id, ...restBookCopy } = bookCopy
		await this.collection.updateOne({
			_id: new ObjectId(id.value)
		}, {
			"$set": {
				...restBookCopy,
				bookId: new ObjectId(restBookCopy.bookId.value),
				userId: bookCopy.getUserId ? new ObjectId(bookCopy.getUserId?.value) : undefined
			}
		}, {
			upsert: false
		})
	}
}