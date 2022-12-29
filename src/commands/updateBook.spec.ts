import { describe, it, expect } from "@jest/globals"
import { mock } from "jest-mock-extended"
import { Book } from "../common/entities/book"
import { BookNotFoundError } from "../common/error/bookNotFoundError"
import { BookRepository, UpdateBookCommand } from "./updateBook"

describe("updateBook.ts", () => {
	const bookRepository = mock<BookRepository>()
	const stub = new UpdateBookCommand(bookRepository)
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

	it("should update a book", async () => {
		const result = await stub.execute({
			id: "first_book",
			title: "The Boys",
			publisher: "Vertigo"
		})

		expect(result.id.isEqualString("first_book")).toBeTruthy()
		expect(result.title).toEqual("The Boys")
		expect(result.publisher).toEqual("Vertigo")
		expect(result.getISBN).toEqual("978-1-56619-909-4")
	})
	it("should error when using not exist book", async () => {
		await expect(stub.execute({
			id: "other_id",
			title: "The Boys",
			publisher: "Vertigo"
		})).rejects.toThrowError(BookNotFoundError)
	})
})