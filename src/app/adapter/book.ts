import { Book } from "../../common/entities/book"
type BookJSON = {
	id: string
	title: string
	description?: string
	author: string
	publisher: string
	publisherAt: Date
	ISBN: string
}

export function BookToJSON(book: Book): BookJSON {
	return {
		...book,
		ISBN: book.getISBN,
		id: book.id.value,
	}
}