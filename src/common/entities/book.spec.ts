import { it, describe, expect } from "@jest/globals"
import { InvalidISBNError } from "../error/InvalidISBNError"
import { Book } from "./book"

describe("book.ts", () => {
	describe("create simple book", () => {
		const book = Book.create({
			id: "book_id",
			title: "The Boys: Good for soul",
			author: "Darick Robertson",
			publisher: "DC Black Label",
			publisherAt: new Date("2006/01/24"),
			description: "An amizing and dark superhero comic with evil superman and no heros",
			ISBN: "978-1-56619-909-4"
		})

		it("should be a valid book", () => {
			expect(book.title).toEqual("The Boys: Good for soul")
			expect(book.id.isEqualString("book_id")).toBeTruthy()
			expect(book.publisherAt.getFullYear()).toEqual(2006)
			expect(book.publisherAt.getMonth()).toEqual(0)
			expect(book.publisherAt.getDate()).toEqual(24)
		})

		it("should be change title", () => {
			book.title = "The Boys: Revival"
			expect(book.title).not.toEqual("The Boys: Good for soul")
			expect(book.title).toEqual("The Boys: Revival")
		})

		it("should error because try using invalid ISBN", () => {
			expect(book.getISBN).toEqual("978-1-56619-909-4")
			expect(() => book.setISBN("yesye")).toThrowError(InvalidISBNError)
			expect(book.getISBN).toEqual("978-1-56619-909-4")
			expect(() => book.setISBN("978-1-56619-909-5")).not.toThrowError(InvalidISBNError)
		})

		it("should be invalid SBN", () => {
			expect(() => Book.create({
				id: "book_id",
				title: "The Boys: Good for soul",
				author: "Darick Robertson",
				publisher: "DC Black Label",
				publisherAt: new Date("2006/01/24"),
				description: "An amizing and dark superhero comic with evil superman and no heros",
				ISBN: "978-4"
			})).toThrowError(InvalidISBNError)
		})
	})
})
