const express = require('express')
const fs = require('fs/promises')

const app = express()
app.use(express.json())

app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
	res.setHeader('Access-Control-Allow-Origin', '*')

	next()
})

app.get('/', (req, res) => {
	res.status(200)
})

app.post('/submit', async (req, res) => {
	try {
		await fs.readFile('../data.json', 'utf-8')
	} catch (error) {
		await fs.writeFile('../data.json', '[]')
	}

	const data = await fs.readFile('../data.json', 'utf-8')
	const json = JSON.parse(data)

	json.push(req.body)

	await fs.writeFile('../data.json', JSON.stringify(json))

	res.status(200).send('OK')
})

app.get('/data', async (req, res) => {
	const data = await fs.readFile('../data.json', 'utf-8')
	const json = JSON.parse(data)

	res.status(200).send(json)
})

app.delete('/delete', async (req, res) => {
	const auth = JSON.parse(req.headers.authorization)
	if (auth.password) {
		if (auth.password !== 'bikenergy2022') return res.status(401)

		if (!(await fs.readFile('../data.json').catch((x) => null))) return res.status(500)

		await fs.writeFile('../data.json', JSON.stringify('[]'))

		res.status(200)
	} else {
		res.status(401)
	}
})

app.listen(3333, () => {
	console.log(`Bikenergy backend listening on port 3333`)
})

