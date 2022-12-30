import { describe, it, expect } from "@jest/globals"
import { mock } from "jest-mock-extended"
import { Book } from "../common/entities/book"
import { BookCopy, BookCopyStatusEnum } from "../common/entities/bookCopy"
import { User } from "../common/entities/user"
import { BookNotAvaliableToBorrowError } from "../common/error/bookNotAvaliableToBorrowError"
import { BookNotFoundError } from "../common/error/bookNotFoundError"
import { UserNotFoundError } from "../common/error/userNotFoundError"
import { BookCopyRepository, BookRepository, BorrowBookCopyCommand, UserRepository } from "./borrowBookCopy"

describe("borrowBookCopy.ts", () => {
	const userRepository = mock<UserRepository>()
	const bookRepository = mock<BookRepository>()
	const bookCopyRepository = mock<BookCopyRepository>()

	const stub = new BorrowBookCopyCommand(userRepository, bookRepository, bookCopyRepository)

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

	const user = User.create({
		id: "simple_user",
		email: "user@example.com",
		password: "simple@123"
	})

	userRepository.findById.calledWith("simple_user").mockReturnValue(Promise.resolve(user))
	bookRepository.findById.calledWith("book_id").mockReturnValue(Promise.resolve(book))
	bookCopyRepository.findAvaliableCopy.calledWith("book_id").mockReturnValue(Promise.resolve(bookCopy))

	it("should be borrow book", async () => {

		const result = await stub.execute({
			bookId: book.id.value,
			userId: user.id.value
		})

		expect(result.book.getISBN).toEqual(book.getISBN)
		expect(result.copy.id.isEqualString("book_copy_id")).toBeTruthy()
		expect(result.copy.status).toEqual(BookCopyStatusEnum.BORROW)
		expect(result.copy.getUserId?.isEqual(user.id)).toBeTruthy()
	})

	it("should error because book not exist", async () => {
		await expect(stub.execute({
			bookId: book.id.value,
			userId: "another_user_id"
		})).rejects.toThrowError(UserNotFoundError)
	})
	it("should error because book not exist", async () => {
		await expect(stub.execute({
			bookId: "another_book_id",
			userId: user.id.value
		})).rejects.toThrowError(BookNotFoundError)
	})
	it("should error because not have avaliable copy to use", async () => {
		bookCopyRepository.findAvaliableCopy.calledWith("book_id").mockReturnValue(Promise.resolve(null))

		await expect(stub.execute({
			bookId: book.id.value,
			userId: user.id.value
		})).rejects.toThrowError(BookNotAvaliableToBorrowError)
	})
})