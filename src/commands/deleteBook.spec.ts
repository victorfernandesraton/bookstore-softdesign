import { describe, it, expect } from "@jest/globals"
import { mock } from "jest-mock-extended"
import { Book } from "../common/entities/book"
import { BookNotFoundError } from "../common/error/bookNotFoundError"
import { BookRepository, DeleteBookCommand } from "./deleteBook"

describe("deleteBook.ts", () => {
	const bookRepository = mock<BookRepository>()
	const stub = new DeleteBookCommand(bookRepository)
	const firstBook = Book.create({
		id: "first_book",
		title: "The Boys: Good for soul",
		author: "Darick Robertson",
		publisher: "DC Black Label",
		publisherAt: new Date("2006/01/24"),
		description: "An amizing and dark superhero comic with evil superman and no heros",
		ISBN: "978-1-56619-909-4"
	})

	bookRepository.findById.calledWith("first_book").mockReturnValue(firstBook)

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
})