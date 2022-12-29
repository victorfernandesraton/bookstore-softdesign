import { UUID } from "../uuid"

export enum BookCopyStatusEnum {
	DELETED = 0,
	AVALIABLE = 1,
	BORROW = 2,
}

type BookCopyFactory = {
	id?: string,
	bookId: string,
	status?: BookCopyStatusEnum,
	userId?: string,
}

export class BookCopy {
	constructor(
		readonly id: UUID,
		readonly bookId: UUID,
		public status: BookCopyStatusEnum,
		private userId?: UUID,
	) { }

	get getUserId(): UUID | undefined { return this.userId }
	set setUserId(value: string) { this.userId = UUID.create(value) }

	static create(params: BookCopyFactory): BookCopy {
		return new BookCopy(
			UUID.create(params.id),
			UUID.create(params.bookId),
			params.status ? params.status : BookCopyStatusEnum.AVALIABLE,
			params.userId ? UUID.create(params.userId) : undefined,
		)
	}

	borrowToUserId(userId: string) {
		this.userId = UUID.create(userId)
		this.status = BookCopyStatusEnum.BORROW
	}

	unborrow() {
		this.userId = undefined
		this.status = BookCopyStatusEnum.AVALIABLE
	}
	delete() {
		this.unborrow()
		this.status = BookCopyStatusEnum.DELETED
	}
}