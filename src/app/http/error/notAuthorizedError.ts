export class NotAuthorizedError extends Error {
	constructor() {
		super()
		this.name = "NotAuthorized"
	}
}