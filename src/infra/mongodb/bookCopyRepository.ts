import { Collection, ObjectId } from "mongodb"
import { BookCopy, BookCopyStatusEnum } from "../../common/entities/bookCopy"

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
}