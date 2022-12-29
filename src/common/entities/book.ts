import { InvalidISBNError } from "../error/invalidISBNError"
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

type BookUpdateParams = {
	title?: string
	description?: string
	author?: string
	publisher?: string
	publisherAt?: Date
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

	update(params: BookUpdateParams) {
		if (params.title) {
			this.title = params.title
		}
		if (params.author) {
			this.author = params.author
		}
		if (params.description) {
			this.description = params.description
		}
		if (params.publisher) {
			this.publisher = params.publisher
		}
		if (params.publisherAt) {
			this.publisherAt = params.publisherAt
		}
	}

	get getISBN() {
		return this.ISBN
	}
}