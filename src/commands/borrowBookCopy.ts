import { Book } from "../common/entities/book"
import { BookCopy } from "../common/entities/bookCopy"
import { User } from "../common/entities/user"
import { BookNotAvaliableToBorrowError } from "../common/error/bookNotAvaliableToBorrowError"
import { BookNotFoundError } from "../common/error/bookNotFoundError"
import { UserNotFoundError } from "../common/error/userNotFoundError"
import { UseCase } from "../common/usecase"

type BorrowBookCopyCommandResponse = {
	book: Book,
	copy: BookCopy
}

type BorrowBookCopyCommandParams = {
	bookId: string;
	userId: string;
}

export interface UserRepository {
	findById(id: string): Promise<User>
}

export interface BookRepository {
	findById(id: string): Promise<Book>
}

export interface BookCopyRepository {
	findAvaliableCopy(bookId: string): Promise<BookCopy>
	update(bookCopy: BookCopy): Promise<void>
}

export class BorrowBookCopyCommand implements UseCase<BorrowBookCopyCommandParams, BorrowBookCopyCommandResponse> {
	constructor(
		private readonly userRepository: UserRepository,
		private readonly bookRepository: BookRepository,
		private readonly bookCopyRepository: BookCopyRepository
	) { }
	async execute({ userId, bookId }: BorrowBookCopyCommandParams): Promise<BorrowBookCopyCommandResponse> {
		const [user, book] = await Promise.all([
			this.userRepository.findById(userId),
			this.bookRepository.findById(bookId)
		])

		if (!user) {
			throw new UserNotFoundError()
		}

		if (!book) {
			throw new BookNotFoundError()
		}

		const avaliableCopy = await this.bookCopyRepository.findAvaliableCopy(book.id.value)

		if (!avaliableCopy) {
			throw new BookNotAvaliableToBorrowError()
		}

		avaliableCopy.borrowToUserId(user.id.value)

		await this.bookCopyRepository.update(avaliableCopy)

		return {
			book,
			copy: avaliableCopy
		}
	}

}