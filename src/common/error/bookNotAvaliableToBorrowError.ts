export class BookNotAvaliableToBorrowError extends Error {
	constructor() {
		super()
		this.name = "BookNotAvaliableToBorrow"
	}
}