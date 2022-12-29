import { ObjectID } from "bson"
import { Book } from "../common/entities/book"
import { BookIsAlredyExistError } from "../common/error/bookIsAlredyExistError"
import { InvalidISBNError } from "../common/error/invalidISBNError"
import { UseCase } from "../common/usecase"

type CreateBookCommandParams = {
	title: string
	description?: string
	author: string
	publisher: string
	publisherAt: Date
	ISBN: string
}

export interface BookRepository {
	save(book: Book): Promise<void>
	findByISBN(ISBN: string): Promise<Book[]>
}

export class CreateBookCommand implements UseCase<CreateBookCommandParams, Book> {
	constructor(private readonly bookRepository: BookRepository) { }
	async execute(params: CreateBookCommandParams): Promise<Book> {

		if (!Book.validateISBN(params.ISBN)) {
			throw new InvalidISBNError()
		}

		const findBooks = await this.bookRepository.findByISBN(params.ISBN)

		if (findBooks.length > 0) {
			throw new BookIsAlredyExistError()
		}


		const book = Book.create({ ...params, id: new ObjectID().toString() })

		await this.bookRepository.save(book)

		return book
	}
}