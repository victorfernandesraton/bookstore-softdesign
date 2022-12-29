import { ObjectId } from "mongodb"
import { Book } from "../common/entities/book"
import { BookCopy } from "../common/entities/bookCopy"
import { BookNotFoundError } from "../common/error/bookNotFoundError"
import { UseCase } from "../common/usecase"

type CreateBookCopyCommandParams = {
	bookId: string
}

export interface BookRepository {
	findById(id: string): Promise<Book>
}

export interface BookCopyRepository {
	save(bookCopy: BookCopy): Promise<void>
}

export class CreateBookCopyCommand implements UseCase<CreateBookCopyCommandParams, BookCopy> {
	constructor(private readonly bookRepository: BookRepository, private readonly bookCopyRepository: BookCopyRepository) { }
	async execute({ bookId }: CreateBookCopyCommandParams): Promise<BookCopy> {
		const book = await this.bookRepository.findById(bookId)

		if (!book) {
			throw new BookNotFoundError()
		}

		const bookCopy = BookCopy.create({
			id: new ObjectId().toString(),
			bookId: book.id.value,
		})

		await this.bookCopyRepository.save(bookCopy)

		return bookCopy
	}
}