import { FastifyInstance, FastifyPluginAsync, FastifyReply, FastifyRequest } from "fastify"
import fp from "fastify-plugin"
import { CreateBookCommand } from "../../commands/createBook"
import { CreateBookCopyCommand } from "../../commands/createBookCopy"
import { DeleteBookCommand } from "../../commands/deleteBook"
import { UpdateBookCommand } from "../../commands/updateBook"
import { BookIsAlredyExistError } from "../../common/error/bookIsAlredyExistError"
import { BookNotFoundError } from "../../common/error/bookNotFoundError"
import { InvalidISBNError } from "../../common/error/invalidISBNError"
import { BookCopyDocument, BookCopyRepository } from "../../infra/mongodb/bookCopyRepository"
import { BookDocument, BookRepository } from "../../infra/mongodb/bookRepository"
import { GetOneBookInfoQuery } from "../../query/mongodb/getBookInfo"
import { ListAllBooksQuery } from "../../query/mongodb/listAllBooks"
import { BookToJSON } from "../adapter/book"
import { BookCopyToJSON } from "../adapter/bookCopy"

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

const bookRoute: FastifyPluginAsync = async (fastify: FastifyInstance) => {
	const db = fastify.mongo.client.db("mydb")

	const booksCollection = db.collection<BookDocument>("book")
	const booksCopyCollection = db.collection<BookCopyDocument>("bookCopy")

	const bookRepository = new BookRepository(booksCollection)
	const bookCopyRepository = new BookCopyRepository(booksCopyCollection)

	const listAllBooksQuery = new ListAllBooksQuery(booksCollection)
	const getOneBookInfoQuery = new GetOneBookInfoQuery(booksCollection)
	const createBookCommand = new CreateBookCommand(bookRepository)
	const updateBookCommand = new UpdateBookCommand(bookRepository)
	const deleteBookCommand = new DeleteBookCommand(bookRepository)
	const createBookCopyCommand = new CreateBookCopyCommand(bookRepository, bookCopyRepository)

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
				res.code(412).send(error)
				return
			case error instanceof BookIsAlredyExistError:
				res.code(409).send(error)
				return

			default:
				res.code(500).send(error)
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
				res.code(404).send(error)
				return

			default:
				res.code(500).send(error)
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
				res.code(412).send(error)
				return
			case error instanceof BookNotFoundError:
				res.code(404).send(error)
				return

			default:
				res.code(500).send(error)
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
				res.code(404).send(error)
				return

			default:
				res.code(500).send(error)
				return
			}
		}
	})

	fastify.post("/books/:id/copy", async (req: FastifyRequest<{
		Params: CreateBookCopyParams
	}>, res: FastifyReply) => {
		try {
			const { id } = req.params
			const bookCopy = await createBookCopyCommand.execute({ bookId: id })

			return res.status(200).send(BookCopyToJSON(bookCopy))
		} catch (error) {
			switch (true) {
			case error instanceof BookNotFoundError:
				res.code(404).send(error)
				return

			default:
				res.code(500).send(error)
				return
			}
		}
	})
	fastify.post("/books/:id/borrow", async (req: FastifyRequest<{
		Params: CreateBorrowBookParams
	}>, res: FastifyReply) => {
		try {
			const { id } = req.params

			console.log(req.user)

			res.code(201).send()
			// const bookCopy = await createBookCopyCommand.execute({ bookId: id })

			// return res.status(200).send(BookCopyToJSON(bookCopy))
		} catch (error) {
			switch (true) {
			case error instanceof BookNotFoundError:
				res.code(404).send(error)
				return

			default:
				res.code(500).send(error)
				return
			}
		}
	})
}

export default fp(bookRoute)