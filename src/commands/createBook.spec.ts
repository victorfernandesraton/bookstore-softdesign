import { describe, it, expect } from "@jest/globals"
import { any, mock } from "jest-mock-extended"
import { Book } from "../common/entities/book"
import { BookIsAlredyExistError } from "../common/error/bookIsAlredyExistError"
import { InvalidISBNError } from "../common/error/invalidISBNError"
import { BookRepository, CreateBookCommand } from "./createBook"

describe("createBook.ts", () => {
	const bookRepository = mock<BookRepository>()
	const stub = new CreateBookCommand(bookRepository)

	it("should create a new book", async () => {
		bookRepository.findByISBN.calledWith(any()).mockReturnValue([])

		const result = await stub.execute({
			title: "The Boys: Good for soul",
			author: "Darick Robertson",
			publisher: "DC Black Label",
			publisherAt: new Date("2006/01/24"),
			description: "An amizing and dark superhero comic with evil superman and no heros",
			ISBN: "978-1-56619-909-4"
		})

		expect(result.title).toEqual("The Boys: Good for soul")
		expect(result.getISBN).toEqual("978-1-56619-909-4")
	})
	it("should error because ISBN is invalid", async () => {
		bookRepository.findByISBN.calledWith(any()).mockReturnValue([])
		await expect(stub.execute({
			title: "The Boys: Good for soul",
			author: "Darick Robertson",
			publisher: "DC Black Label",
			publisherAt: new Date("2006/01/24"),
			description: "An amizing and dark superhero comic with evil superman and no heros",
			ISBN: "862.288.875-48"
		})).rejects.toThrowError(InvalidISBNError)
	})
	it("should error because ISBN has been in use", async () => {
		bookRepository.findByISBN.calledWith(any()).mockReturnValue([Book])
		await expect(stub.execute({
			title: "The Boys: Good for soul",
			author: "Darick Robertson",
			publisher: "DC Black Label",
			publisherAt: new Date("2006/01/24"),
			description: "An amizing and dark superhero comic with evil superman and no heros",
			ISBN: "978-1-56619-909-4"
		})).rejects.toThrowError(BookIsAlredyExistError)
	})
})