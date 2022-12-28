export class InvalidMailError extends Error {
	constructor() {
		super()
		this.name = "InvalidMailError"
	}
}