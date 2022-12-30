import { FastifyInstance, FastifyPluginAsync, FastifyReply, FastifyRequest } from "fastify"
import fp from "fastify-plugin"
import { BorrowBookCopyCommand } from "../../commands/borrowBookCopy"
import { CreateBookCommand } from "../../commands/createBook"
import { CreateBookCopyCommand } from "../../commands/createBookCopy"
import { DeleteBookCommand } from "../../commands/deleteBook"
import { UserNotAllowedToUnborrowBookCopyError } from "../../commands/error/userNotAllowedToUnborrowBookCopyError"
import { UnborrowBookCopyCommand } from "../../commands/unborrowBookCopy"
import { UpdateBookCommand } from "../../commands/updateBook"
import { Book } from "../../common/entities/book"
import { BookCopy } from "../../common/entities/bookCopy"
import { BookCopyNotFoundError } from "../../common/error/bookCopyNotFoundError"
import { BookIsAlredyExistError } from "../../common/error/bookIsAlredyExistError"
import { BookNotAvaliableToBorrowError } from "../../common/error/bookNotAvaliableToBorrowError"
import { BookNotFoundError } from "../../common/error/bookNotFoundError"
import { InvalidISBNError } from "../../common/error/invalidISBNError"
import { UserNotFoundError } from "../../common/error/userNotFoundError"
import { BookCopyDocument, BookCopyRepository } from "../../infra/mongodb/bookCopyRepository"
import { BookDocument, BookRepository } from "../../infra/mongodb/bookRepository"
import { UserDocument, UserRepository } from "../../infra/mongodb/userRepository"
import { GetOneBookInfoQuery } from "../../query/mongodb/getBookInfo"
import { GetBooksForUserQuery } from "../../query/mongodb/getBooksForUser"
import { ListAllBooksQuery } from "../../query/mongodb/listAllBooks"
import { BookToJSON } from "../adapter/book"
import { BookCopyToJSON } from "../adapter/bookCopy"
import { UserToJSON } from "../adapter/user"

type ListAllBooksParams = {
	query?: string
	limit?: string
	offset?: string
}

type CreateBookQueryParams = {
	title: string
	description?: string
	author: string
	publisher: string
	publisherAt: Date
	ISBN: string
}
type UpdateBookQueryParams = {
	title?: string
	description?: string
	author?: string
	publisher?: string
	publisherAt?: Date
}

type UpdateBookParams = {
	id: string
}

type DeleteBookParams = UpdateBookParams;

type CreateBookCopyParams = UpdateBookParams;

type GetBookInfoParams = UpdateBookParams;

type CreateBorrowBookParams = UpdateBookParams;

type UnborrowBookCopyParams = { bookCopyId: string }

const bookRoute: FastifyPluginAsync = async (fastify: FastifyInstance) => {
	const db = fastify.mongo.client.db("mydb")

	const userCollection = db.collection<UserDocument>("user")
	const booksCollection = db.collection<BookDocument>("book")
	const booksCopyCollection = db.collection<BookCopyDocument>("bookCopy")

	const userRepository = new UserRepository(userCollection)
	const bookRepository = new BookRepository(booksCollection)
	const bookCopyRepository = new BookCopyRepository(booksCopyCollection)


	const listAllBooksQuery = new ListAllBooksQuery(booksCollection)
	const getOneBookInfoQuery = new GetOneBookInfoQuery(booksCollection)
	const getBooksForUserQuery = new GetBooksForUserQuery(booksCopyCollection, userCollection)

	const createBookCommand = new CreateBookCommand(bookRepository)
	const updateBookCommand = new UpdateBookCommand(bookRepository)
	const deleteBookCommand = new DeleteBookCommand(bookRepository, bookCopyRepository)
	const createBookCopyCommand = new CreateBookCopyCommand(bookRepository, bookCopyRepository)
	const borrowBookCopyCommand = new BorrowBookCopyCommand(userRepository, bookRepository, bookCopyRepository)
	const unborrowBookCopyCommand = new UnborrowBookCopyCommand(userRepository, bookCopyRepository)

	fastify.addHook("preHandler", fastify.auth)

	fastify.get("/books", async (req: FastifyRequest<{
		Querystring: ListAllBooksParams,
	}>, res: FastifyReply) => {
		const result = await listAllBooksQuery.execute({
			...req.query,
			limit: req.query.limit ? parseInt(req.query.limit) : undefined,
			offset: req.query.offset ? parseInt(req.query.offset) : undefined
		})

		res.code(200).send({
			...result,
			data: result.data.map(BookToJSON)
		})
	})

	fastify.post("/books", async (req: FastifyRequest<{ Body: CreateBookQueryParams }>, res: FastifyReply) => {
		try {
			const book = await createBookCommand.execute({ ...req.body })

			return res.status(201).send(BookToJSON(book))
		} catch (error) {
			switch (true) {
			case error instanceof InvalidISBNError:
				res.code(412).send({ error })
				return
			case error instanceof BookIsAlredyExistError:
				res.code(409).send({ error })
				return

			default:
				res.code(500).send({ error })
				return
			}
		}

	})

	fastify.get("/books/:id", async (req: FastifyRequest<{
		Params: GetBookInfoParams
	}>, res: FastifyReply) => {
		try {
			const { id } = req.params
			const bookInfo = await getOneBookInfoQuery.execute({ id })

			return res.status(200).send({
				book: BookToJSON(bookInfo.book),
				copies: bookInfo.copies.map(BookCopyToJSON)
			})
		} catch (error) {
			switch (true) {
			case error instanceof BookNotFoundError:
				res.code(404).send({ error })
				return

			default:
				res.code(500).send({ error })
				return
			}
		}
	})

	fastify.put("/books/:id", async (req: FastifyRequest<{
		Body: UpdateBookQueryParams,
		Params: UpdateBookParams
	}>, res: FastifyReply) => {
		try {
			const { id } = req.params
			const book = await updateBookCommand.execute({ ...req.body, id })

			return res.status(200).send(BookToJSON(book))
		} catch (error) {
			switch (true) {
			case error instanceof InvalidISBNError:
				res.code(412).send({ error })
				return
			case error instanceof BookNotFoundError:
				res.code(404).send({ error })
				return

			default:
				res.code(500).send({ error })
				return
			}
		}
	})

	fastify.delete("/books/:id", async (req: FastifyRequest<{
		Params: DeleteBookParams
	}>, res: FastifyReply) => {
		try {
			const { id } = req.params
			await deleteBookCommand.execute({ id })

			return res.status(200).send()
		} catch (error) {
			switch (true) {

			case error instanceof BookNotFoundError:
				res.code(404).send({ error })
				return

			default:
				res.code(500).send({ error })
				return
			}
		}
	})

	fastify.post("/books/copy/:id", async (req: FastifyRequest<{
		Params: CreateBookCopyParams
	}>, res: FastifyReply) => {
		try {
			const { id } = req.params
			const bookCopy = await createBookCopyCommand.execute({ bookId: id })

			return res.status(200).send(BookCopyToJSON(bookCopy))
		} catch (error) {
			switch (true) {
			case error instanceof BookNotFoundError:
				res.code(404).send({ error })
				return

			default:
				res.code(500).send({ error })
				return
			}
		}
	})
	fastify.put("/books/borrow/:id", async (req: FastifyRequest<{
		Params: CreateBorrowBookParams,
	}>, res: FastifyReply) => {
		try {
			const { id } = req.params
			const user = JSON.parse(req.user.toString())

			const response = await borrowBookCopyCommand.execute({
				bookId: id,
				userId: user.id
			})

			res.code(201).send({
				book: BookToJSON(response.book),
				copy: BookCopyToJSON(response.copy)
			})
		} catch (error) {
			switch (true) {
			case error instanceof UserNotFoundError:
			case error instanceof BookNotFoundError:
				res.code(404).send({ error })
				return

			case error instanceof BookNotAvaliableToBorrowError:
				res.code(409).send({ error })
				return
			default:
				res.code(500).send({ error })
				return
			}
		}
	})

	fastify.put("/books/copy/unborrow/:bookCopyId", async (req: FastifyRequest<{
		Params: UnborrowBookCopyParams,
	}>, res: FastifyReply) => {
		try {
			const { bookCopyId } = req.params
			const user = JSON.parse(req.user.toString())

			const response = await unborrowBookCopyCommand.execute({
				userId: user.id,
				bookCopyId,
			})

			res.code(200).send(BookCopyToJSON(response))
		} catch (error) {
			switch (true) {
			case error instanceof UserNotFoundError:
			case error instanceof BookCopyNotFoundError:
				res.code(404).send({ error })
				return

			case error instanceof UserNotAllowedToUnborrowBookCopyError:
				res.code(412).send({ error })
				return
			default:
				res.code(500).send({ error })
				return
			}
		}
	})

	fastify.get("/books/me", async (req: FastifyRequest, res: FastifyReply) => {
		try {
			const user = JSON.parse(req.user.toString())

			const response = await getBooksForUserQuery.execute({
				userId: user.id,
			})

			const userResponse = UserToJSON(response.user)

			const copyResponse = response.copies.map(item => ({
				copy: BookCopyToJSON(BookCopy.create({
					bookId: item.bookId.toString(),
					id: item._id.toString(),
					status: item.status,
					userId: item.userId ? item.userId.toString() : undefined
				})),
				book: item.book.map(book => BookToJSON(Book.create({
					id: book._id,
					ISBN: book.ISBN,
					description: book.description ?? undefined,
					author: book.author,
					publisher: book.publisher,
					publisherAt: book.publisherAt,
					title: book.title
				})))[0]
			}))

			res.code(200).send({
				user: userResponse,
				copies: copyResponse
			})
		} catch (error) {
			console.log(error)
			switch (true) {
			case error instanceof UserNotFoundError:
				res.code(404).send({ error })
				return

			default:
				res.code(500).send({ error })
				return
			}
		}
	})
}

export default fp(bookRoute)