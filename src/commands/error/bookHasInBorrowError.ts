export class BookHasInBorrowError extends Error {
	constructor() {
		super()
		this.name = "BookHasInBorrow"
	}
}