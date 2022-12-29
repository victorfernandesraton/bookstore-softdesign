export class InvalidISBNError extends Error {
	constructor() {
		super()
		this.name = "InvalidISBN"
	}
}