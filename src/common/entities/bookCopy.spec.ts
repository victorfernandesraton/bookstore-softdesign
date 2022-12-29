import { it, describe, expect } from "@jest/globals"
import { Book } from "./book"
import { BookCopy, BookCopyStatusEnum } from "./bookCopy"

describe("bookCopy.ts", () => {
	const book = Book.create({
		id: "book_id",
		title: "The Boys: Good for soul",
		author: "Darick Robertson",
		publisher: "DC Black Label",
		publisherAt: new Date("2006/01/24"),
		description: "An amizing and dark superhero comic with evil superman and no heros",
		ISBN: "978-1-56619-909-4"
	})

	const bookCopy = BookCopy.create({
		id: "book_copy_id",
		bookId: book.id.value,
	})
	it("should a valid book copy", () => {
		expect(bookCopy.bookId.isEqual(book.id)).toBeTruthy()
		expect(bookCopy.getUserId).toBeUndefined()
		expect(bookCopy.status).toEqual(BookCopyStatusEnum.AVALIABLE)
	})

	it("should borrow book to user", () => {
		bookCopy.borrowToUserId("user_id")

		expect(bookCopy.bookId.isEqual(book.id)).toBeTruthy()
		expect(bookCopy.getUserId?.isEqualString("user_id")).toBeTruthy()
		expect(bookCopy.status).toEqual(BookCopyStatusEnum.BORROW)
	})

	it("should unborrow book to user", () => {
		bookCopy.unborrow()

		expect(bookCopy.bookId.isEqual(book.id)).toBeTruthy()
		expect(bookCopy.getUserId).toBeUndefined()
		expect(bookCopy.status).toEqual(BookCopyStatusEnum.AVALIABLE)
	})

	it("should delete", () => {
		bookCopy.delete()

		expect(bookCopy.bookId.isEqual(book.id)).toBeTruthy()
		expect(bookCopy.getUserId).toBeUndefined()
		expect(bookCopy.status).toEqual(BookCopyStatusEnum.DELETED)
	})
})