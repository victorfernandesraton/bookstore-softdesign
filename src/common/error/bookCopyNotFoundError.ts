export class BookCopyNotFoundError extends Error {
	constructor() {
		super()
		this.name = "BookCopyNotFound"
	}
}