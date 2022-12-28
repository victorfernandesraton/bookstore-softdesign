import dotenv from "dotenv"


dotenv.config()

export default {
	mongodb: {
		host: process.env.MONGODB_HOST
	},
	server: {
		host: process.env.HOST,
		port: process.env.PORT ? parseInt(process.env.PORT, 10) :3000
	}
}