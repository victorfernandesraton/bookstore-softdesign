import { describe, it, expect } from "@jest/globals"
import { mock } from "jest-mock-extended"
import { BookCopy, BookCopyStatusEnum } from "../common/entities/bookCopy"
import { User } from "../common/entities/user"
import { BookCopyNotFoundError } from "../common/error/bookCopyNotFoundError"
import { UserNotFoundError } from "../common/error/userNotFoundError"
import { UserNotAllowedToUnborrowBookCopyError } from "./error/userNotAllowedToUnborrowBookCopyError"
import { BookCopyRepository, UnborrowBookCopyCommand, UserRepository } from "./unborrowBookCopy"

describe("unborrowBookCopy.ts", () => {
	const userRepository = mock<UserRepository>()
	const bookCopyRepository = mock<BookCopyRepository>()

	const stub = new UnborrowBookCopyCommand(userRepository, bookCopyRepository)

	const user = User.create({
		id: "simple_user",
		email: "user@example.com",
		password: "simple@123"
	})
	const bookCopy = BookCopy.create({
		id: "book_copy_id",
		bookId: "book_id",
		userId: user.id.value,
		status: BookCopyStatusEnum.BORROW
	})

	const otherBookCopy = BookCopy.create({
		id: "book_copy_id",
		bookId: "book_id",
		userId: "another_user_id",
		status: BookCopyStatusEnum.BORROW
	})


	userRepository.findById.calledWith("simple_user").mockReturnValue(Promise.resolve(user))
	bookCopyRepository.findById.calledWith("book_copy_id").mockReturnValue(Promise.resolve(bookCopy))

	it("should be unborrow book", async () => {
		const response = await stub.execute({
			bookCopyId: "book_copy_id",
			userId: "simple_user"
		})

		expect(response.status).toEqual(BookCopyStatusEnum.AVALIABLE)
		expect(response.getUserId).toBeUndefined()
		expect(response.bookId.isEqualString("book_id"))
	})

	it("should error because user not found", async () => {
		await expect(stub.execute({
			bookCopyId: "book_copy_id",
			userId: "other_user"
		})).rejects.toThrowError(UserNotFoundError)
	})

	it("should error because bookCopy not found", async () => {
		await expect(stub.execute({
			bookCopyId: "another_copy_id",
			userId: "simple_user"
		})).rejects.toThrowError(BookCopyNotFoundError)
	})

	it("should error because user is not allowed", async () => {
		bookCopyRepository.findById.calledWith("book_copy_id").mockReturnValue(Promise.resolve(otherBookCopy))
		await expect(stub.execute({
			bookCopyId: "book_copy_id",
			userId: "simple_user"
		})).rejects.toThrowError(UserNotAllowedToUnborrowBookCopyError)
	})
})
