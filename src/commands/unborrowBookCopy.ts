import { BookCopy } from "../common/entities/bookCopy"
import { User } from "../common/entities/user"
import { BookCopyNotFoundError } from "../common/error/bookCopyNotFoundError"
import { UserNotFoundError } from "../common/error/userNotFoundError"
import { UseCase } from "../common/usecase"
import { UserNotAllowedToUnborrowBookCopyError } from "./error/userNotAllowedToUnborrowBookCopyError"

type UnborrowBookCopyCommandParams = {
	bookCopyId: string
	userId: string
}

export interface BookCopyRepository {
	findById(id: string): Promise<BookCopy>
	update(bookCopy: BookCopy): Promise<void>
}

export interface UserRepository {
	findById(id: string): Promise<User>
}

export class UnborrowBookCopyCommand implements UseCase<UnborrowBookCopyCommandParams, BookCopy> {
	constructor(
		private readonly userRepository: UserRepository,
		private readonly bookCopyRepository: BookCopyRepository,
	) { }
	async execute({ bookCopyId, userId }: UnborrowBookCopyCommandParams): Promise<BookCopy> {
		const [user, bookCopy] = await Promise.all([
			this.userRepository.findById(userId),
			this.bookCopyRepository.findById(bookCopyId)
		])

		if (!user) {
			throw new UserNotFoundError()
		}

		if (!bookCopy) {
			throw new BookCopyNotFoundError()
		}

		if (!bookCopy.getUserId?.isEqual(user.id)) {
			throw new UserNotAllowedToUnborrowBookCopyError()
		}

		bookCopy.unborrow()

		await this.bookCopyRepository.update(bookCopy)

		return bookCopy

	}

}