import { Book } from "../common/entities/book"
import { UseCase } from "../common/usecase"
import { BookNotFoundError } from "../common/error/bookNotFoundError"

type UpdateBookCommandParams = {
	id: string
	title?: string
	description?: string
	author?: string
	publisher?: string
	publisherAt?: Date
}

export interface BookRepository {
	findById(id: string): Promise<Book>
	update(book: Book): Promise<void>
}

export class UpdateBookCommand implements UseCase<UpdateBookCommandParams, Book> {
	constructor(private readonly bookRepository: BookRepository) { }
	async execute(params: UpdateBookCommandParams): Promise<Book> {
		const { id, ...rest } = params
		const findBook = await this.bookRepository.findById(id)

		if (!findBook) {
			throw new BookNotFoundError()
		}

		findBook.update(rest)

		await this.bookRepository.update(findBook)

		return findBook
	}
}