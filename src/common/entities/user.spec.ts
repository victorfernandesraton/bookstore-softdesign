import {it, describe, expect} from "@jest/globals"
import { User } from "./user"

describe("user.ts", () => {
	describe("create simple user", () => {
		const user = User.create({
			id: "simple_user",
			email: "user@example.com",
			password: "simple@123"
		})

		it("should be valid datas", () => {
			expect(user.email).toEqual("user@example.com")
			expect(user.getPassword).not.toEqual("simple@123")
			expect(user.id.value).toEqual("simple_user")
		})
		it("should be test password", () => {
			expect(user.isEqualPassword("test")).toBeFalsy()
		})

		it("shoudn't is same password", () => {
			expect(user.isEqualPassword("simple@123")).toBeTruthy()
		})
		it("update email", () => {
			user.email = "otheremail@example.com"
			expect(user.email).toEqual("otheremail@example.com")
		})

		it("update password", () => {
			user.updatePassword("test")
			expect(user.getPassword).not.toEqual("test")
			expect(user.isEqualPassword("test")).toBeTruthy()

		})
	})
})