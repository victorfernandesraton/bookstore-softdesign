import { describe, it, expect } from "@jest/globals"
import { mock } from "jest-mock-extended"
import { Book } from "../common/entities/book"
import { BookCopyStatusEnum } from "../common/entities/bookCopy"
import { BookNotFoundError } from "../common/error/bookNotFoundError"
import { BookCopyRepository, BookRepository, CreateBookCopyCommand } from "./createBookCopy"

describe("createBook.ts", () => {
	const bookRepository = mock<BookRepository>()
	const bookCopyRepository = mock<BookCopyRepository>()
	const stub = new CreateBookCopyCommand(bookRepository, bookCopyRepository)

	const book = Book.create({
		id: "book_id",
		title: "The Boys: Good for soul",
		author: "Darick Robertson",
		publisher: "DC Black Label",
		publisherAt: new Date("2006/01/24"),
		description: "An amizing and dark superhero comic with evil superman and no heros",
		ISBN: "978-1-56619-909-4"
	})
	bookRepository.findById.calledWith("book_id").mockReturnValue(book)
	it("should create a new book", async () => {

		const result = await stub.execute({
			bookId: "book_id"
		})

		expect(result.bookId.isEqual(book.id)).toBeTruthy()
		expect(result.getUserId).toBeUndefined()
		expect(result.status).toEqual(BookCopyStatusEnum.AVALIABLE)

	})
	it("should error because book is not found", async () => {
		await expect(stub.execute({
			bookId: "other_id"
		})).rejects.toThrowError(BookNotFoundError)
	})
})