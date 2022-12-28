import { UUID } from "../uuid"

type BookFactoryParams = {
	id?: string
	title: string
	description?: string
	author: string
	publisher: string
	publisherAt: Date
}

export class Book {
	constructor(
		readonly id: UUID,
		public title: string,
		public author: string,
		public publisher: string,
		public publisherAt: Date,
		public description?: string,
	) {
	}

	static create(params: BookFactoryParams): Book {
		return new Book(UUID.create(params.id), params.title, params.author, params.publisher, params.publisherAt, params.description)
	}
}