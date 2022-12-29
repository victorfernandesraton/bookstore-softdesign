export class BookIsAlredyExistError extends Error {
	constructor() {
		super()
		this.name = "BookIsAlredyExist"
	}
}