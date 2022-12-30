import { describe, it, expect } from "@jest/globals"
import { mock } from "jest-mock-extended"
import { Book } from "../common/entities/book"
import { BookCopy, BookCopyStatusEnum } from "../common/entities/bookCopy"
import { BookNotFoundError } from "../common/error/bookNotFoundError"
import { BookCopyRepository, BookRepository, DeleteBookCommand } from "./deleteBook"
import { BookHasInBorrowError } from "./error/bookHasInBorrowError"

describe("deleteBook.ts", () => {
	const bookRepository = mock<BookRepository>()
	const bookCopyRepository = mock<BookCopyRepository>()
	const stub = new DeleteBookCommand(bookRepository, bookCopyRepository)
	const firstBook = Book.create({
		id: "first_book",
		title: "The Boys: Good for soul",
		author: "Darick Robertson",
		publisher: "DC Black Label",
		publisherAt: new Date("2006/01/24"),
		description: "An amizing and dark superhero comic with evil superman and no heros",
		ISBN: "978-1-56619-909-4"
	})

	const bookCopy = BookCopy.create({
		id: "book_copy_id",
		bookId: "book_id",
		userId: "user_id",
		status: BookCopyStatusEnum.BORROW
	})


	bookRepository.findById.calledWith("first_book").mockReturnValue(firstBook)
	bookCopyRepository.findInBorrowByBook.calledWith("first_book").mockReturnValue(Promise.resolve([]))

	it("should delete a book", async () => {
		await expect(stub.execute({
			id: "first_book",
		})).resolves.not.toThrowError()
	})
	it("should error when using not exist book", async () => {
		await expect(stub.execute({
			id: "other_id",
		})).rejects.toThrowError(BookNotFoundError)
	})
	it("should error because has copy borrowed", async () => {
		bookCopyRepository.findInBorrowByBook.calledWith("first_book").mockReturnValue(Promise.resolve([bookCopy]))

		await expect(stub.execute({
			id: "first_book",
		})).rejects.toThrowError(BookHasInBorrowError)
	})
})