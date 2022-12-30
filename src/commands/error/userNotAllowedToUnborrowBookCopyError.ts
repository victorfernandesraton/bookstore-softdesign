export class UserNotAllowedToUnborrowBookCopyError extends Error {
	constructor() {
		super()
		this.name = "UserNotAllowedToUnborrowBookCopy"
	}
}