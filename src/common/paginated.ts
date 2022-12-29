export type Paginated<Type> = {
	data: Type[],
	limit: number,
	offset: number,
	total: number
}