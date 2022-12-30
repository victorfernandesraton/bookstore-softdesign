import { Book } from "../common/entities/book"
import { UseCase } from "../common/usecase"
import { BookNotFoundError } from "../common/error/bookNotFoundError"
import { BookCopy } from "../common/entities/bookCopy"
import { BookHasInBorrowError } from "./error/bookHasInBorrowError"

type DeleteBookCommandParams = {
	id: string
}

export interface BookRepository {
	findById(id: string): Promise<Book>
	delete(id: string): Promise<void>
}

export interface BookCopyRepository {
	findInBorrowByBook(bookId: string): Promise<BookCopy[]>
}

export class DeleteBookCommand implements UseCase<DeleteBookCommandParams, void> {
	constructor(
		private readonly bookRepository: BookRepository,
		private readonly bookCopyRepository: BookCopyRepository
	) { }
	async execute({ id }: DeleteBookCommandParams): Promise<void> {
		const findBook = await this.bookRepository.findById(id)

		if (!findBook) {
			throw new BookNotFoundError()
		}

		const borrowCopies = await this.bookCopyRepository.findInBorrowByBook(findBook.id.value)

		if (borrowCopies.length > 0) {
			throw new BookHasInBorrowError()
		}

		await this.bookRepository.delete(findBook.id.value)

	}
}