// const requestLogger = (request, response, next) => {
//   console.log('Method:', request.method)
//   console.log('Path:  ', request.path)
//   console.log('Body:  ', request.body)
//   console.log('---')
//   next()
// }

// -------------------------------------

const express = require('express')
const app = express()

const morgan = require('morgan')
morgan.token('data', function(req, res) {
    return JSON.stringify(req.body)
})

const cors = require('cors')
app.use(cors())



const now = new Date()

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data', {skip: (req) => 
    req.method !=="POST" || req.url.includes('/.well-known/')
}))
app.use(express.json())
// app.use(requestLogger)
app.use(express.static('dist'))

let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/', (request, response) => {
    response.send('<h1>Hello World</h1>')
})

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/info', (request, response)=>{
    response.send(`<p>Phonebook has info for ${persons.length} people</p>
        <p>${now}</p>`)
})

app.get('/api/persons/:id', (request, response)=>{
    const id = request.params.id
    const person = persons.filter(p => p.id === id)
    console.log(person)
    if (person.length > 0) {
        return response.json(person)
    } else {
        return response.status(400).json({
            error: "this ID doesn't exist!"
        })
    }

})

const generateId = () => {
    const maxId = notes.length > 0 ? 
    Math.max(...notes.map(n => Number(n.id)))
    : 0
    return String(maxId + 1)
}

const generateRandomId = (max) => {
    return String(Math.floor(Math.random() * max))
}

app.post('/api/persons', (request, response)=>{
    const body = request.body

    if (!body.name || !body.number){
        return response.status(400).json({
            error: 'name or phone number missing'
        })
    }

    const matchedName = persons.find(p => p.name === body.name)

    if (matchedName){
        return response.status(400).json({
            error: 'names must be unique'
        })
    }
    
    const p = {
        id: generateRandomId(500),
        name: body.name,
        number: body.number,
    }
    persons = persons.concat(p)

    response.json(persons)
})

app.put('/api/persons/:id', (request, response)=> {
    const id = request.params.id
    const body = request.body

    const contact = {
        id: id,
        name: body.name,
        number: body.number
    }

    persons = persons.map(p => p.id !== id ? p : contact)

    response.json(contact)
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    persons = persons.filter(p => p.id !== id)

    response.status(204).end()
})
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
