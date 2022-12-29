import { FastifyInstance, FastifyPluginAsync, FastifyReply, FastifyRequest } from "fastify"
import fp from "fastify-plugin"
import { CreateBookCommand } from "../../commands/createBook"
import { UpdateBookCommand } from "../../commands/updateBook"
import { BookIsAlredyExistError } from "../../common/error/bookIsAlredyExistError"
import { BookNotFoundError } from "../../common/error/bookNotFoundError"
import { InvalidISBNError } from "../../common/error/invalidISBNError"
import { BookDocument, BookRepository } from "../../infra/mongodb/bookRepository"
import { ListAllBooksQuery } from "../../query/listAllBooks"
import { BookToJSON } from "../adapter/book"

interface ListAllBooksParams {
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



const bookRoute: FastifyPluginAsync = async (fastify: FastifyInstance) => {
	const db = fastify.mongo.client.db("mydb")
	const booksCollection = db.collection<BookDocument>("book")

	const listAllBooksQuery = new ListAllBooksQuery(booksCollection)
	const bookRepository = new BookRepository(booksCollection)
	const createBookCommand = new CreateBookCommand(bookRepository)
	const updateBookCommand = new UpdateBookCommand(bookRepository)

	fastify.get<{
		Querystring: ListAllBooksParams,
	}>("/books", {
		preHandler: [fastify.auth],

	}, async (req, res: FastifyReply) => {

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

	fastify.put("/books/:id", async (req: FastifyRequest<{
		Body: UpdateBookQueryParams,
		Params: UpdateBookParams
	}>, res: FastifyReply) => {
		try {
			const { id } = req.params
			const book = await updateBookCommand.execute({ ...req.body, id })

			return res.status(201).send(BookToJSON(book))
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
}

export default fp(bookRoute)