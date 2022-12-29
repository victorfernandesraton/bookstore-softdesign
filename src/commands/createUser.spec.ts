import { describe, it, expect } from "@jest/globals"
import { any, mock } from "jest-mock-extended"
import { User } from "../common/entities/user"
import { CreateUserCommand, UserRepository } from "./createUser"
import { InvalidMailError } from "./error/invalidMailError"
import { InvalidPasswordLengthError } from "./error/invalidPasswordLengthError"
import { UserAlreadyExistsError } from "./error/userAlredyExistError"

describe("createUser.ts", () => {
	const userRepositoryMock = mock<UserRepository>()
	const stub = new CreateUserCommand(userRepositoryMock)

	it("should create simple user", async () => {
		const result = await stub.execute({
			email: "user@example.com",
			password: "test@123"
		})
		expect(result.email).toEqual("user@example.com")
		expect(result.getPassword).not.toEqual("test@123")
		expect(result.isEqualPassword("test@123")).toBeTruthy()
	})

	it("should error with invalid email", async () => {
		await expect(stub.execute({
			email: "user_example.com",
			password: "test@123"
		})).rejects.toThrowError(InvalidMailError)
	})
	it("should error with invalid password length", async () => {
		await expect(stub.execute({
			email: "user@example.com",
			password: "tes"
		})).rejects.toThrowError(InvalidPasswordLengthError)
	})
	it("should error with invalid password length", async () => {
		userRepositoryMock.findByMail.calledWith(any()).mockReturnValue(User)
		await expect(stub.execute({
			email: "user@example.com",
			password: "test@123"
		})).rejects.toThrowError(UserAlreadyExistsError)
	})
})