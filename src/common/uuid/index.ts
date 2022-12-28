import { randomUUID } from "node:crypto"

export class UUID {
	private readonly id: string
	constructor(id?: string) {
		if (!id) {
			this.id = randomUUID()
		} else {
			this.id = id
		}
	}

	static create(id?: string): UUID {
		return new UUID(id)
	}

	get value(): string {
		return this.id
	}

	isEqual(other: UUID): boolean {
		return this.value === other.value
	}
	isEqualString(other: string): boolean {
		return this.value === other
	}
}