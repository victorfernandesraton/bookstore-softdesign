import { BookCopy } from "../../common/entities/bookCopy"

type BookCopyJSON = {
	id: string,
	bookId: string,
	status: number,
	userId?: string,
}
export function BookCopyToJSON(book: BookCopy): BookCopyJSON {
	return {
		id: book.id.value,
		bookId: book.bookId.value,
		userId: book.getUserId ? book.getUserId.value : undefined,
		status: book.status
	}
}