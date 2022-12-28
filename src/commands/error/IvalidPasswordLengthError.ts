export class InvalidPasswordLengthError extends Error {
	constructor() {
		super()
		this.name = "InvalidPasswordLength"
	}
}