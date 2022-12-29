export class BookNotFoundError extends Error {
	constructor() {
		super()
		this.name = "BookNotFound"
	}
}