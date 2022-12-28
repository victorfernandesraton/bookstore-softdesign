import { InvalidISBNError } from "../error/InvalidISBNError"
import { UUID } from "../uuid"

type BookFactoryParams = {
	id?: string
	title: string
	description?: string
	author: string
	publisher: string
	publisherAt: Date
	ISBN: string
}

const ISBN_REGEX = /^(?=(?:\D*\d){10}(?:(?:\D*\d){3})?$)[\d-]+$/

export class Book {
	constructor(
		readonly id: UUID,
		public title: string,
		public author: string,
		public publisher: string,
		public publisherAt: Date,
		private ISBN: string,
		public description?: string,
	) {
	}

	static create(params: BookFactoryParams): Book {
		if (!Book.validateISBN(params.ISBN)) {
			throw new InvalidISBNError()
		}
		return new Book(UUID.create(params.id), params.title, params.author, params.publisher, params.publisherAt,
			params.ISBN,
			params.description,
		)
	}

	static validateISBN(code: string): boolean {
		return ISBN_REGEX.test(code)
	}

	setISBN(code: string) {
		if (!Book.validateISBN(code)) {
			throw new InvalidISBNError()
		} else {
			this.ISBN = code
		}
	}

	get getISBN() {
		return this.ISBN
	}
}