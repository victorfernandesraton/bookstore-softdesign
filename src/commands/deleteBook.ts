import { Book } from "../common/entities/book"
import { UseCase } from "../common/usecase"
import { BookNotFoundError } from "../common/error/bookNotFoundError"

type DeleteBookCommandParams = {
	id: string
}

export interface BookRepository {
	findById(id: string): Promise<Book>
	delete(id: string): Promise<void>
}

export class DeleteBookCommand implements UseCase<DeleteBookCommandParams, void> {
	constructor(private readonly bookRepository: BookRepository) { }
	async execute({ id }: DeleteBookCommandParams): Promise<void> {
		const findBook = await this.bookRepository.findById(id)

		if (!findBook) {
			throw new BookNotFoundError()
		}

		await this.bookRepository.delete(findBook.id.value)

	}
}