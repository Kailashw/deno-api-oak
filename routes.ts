import { Router, RouterContext } from 'https://deno.land/x/oak/mod.ts'
import { Response } from "https://deno.land/x/oak/response.ts";

interface Todo {
    description: string
    id: number
}

let todos: Array<Todo> = [
    {
        description: 'Todo 1',
        id: 1,
    },
    {
        description: 'Todo 2',
        id: 2,
    },
]

export const getTodos = (c: RouterContext) => {
    c.response.body = todos
}

export const getTodo = ({
    params,
    response,
}: {
    params: {
        id: string
    }
    response: any
}) => {
    const todo = todos.filter((todo) => todo.id === parseInt(params.id))
    if (todo.length) {
        response.status = 200
        response.body = todo[0]
        return
    }

    response.status = 400
    response.body = { msg: `Cannot find todo ${params.id}` }
}

export const addTodo = async (c: RouterContext) => {
    const body = await c.request.body()
    const { description, id }: { description: string; id: number } = body.value
    todos.push({
        description: description,
        id: id,
    })

    c.response.body = { msg: 'OK' }
    c.response.status = 200
}

export const updateTodo = async (c: RouterContext) => {
    const id = c.params.id
    let response = c.response
    if(id){
        const temp = todos.filter((existingTodo) => existingTodo.id === parseInt(id))
        const body = await c.request.body()
        const description: string  = body.value.description
        if (temp.length) {
            temp[0].description = description
            response.status = 200
            response.body = { msg: 'OK' }
            return
        }
    }

    response.status = 400
    response.body = { msg: `Cannot find todo ${c.params.id}` }
}

type RemoveContext = {
    params: {
        id: string
    }
    response: Response
}

export const removeTodo = (c: RemoveContext) => {
    const lengthBefore = todos.length
    todos = todos.filter((todo) => todo.id !== parseInt(c.params.id))

    let response = c.response
    if (todos.length === lengthBefore) {
        response.status = 400
        response.body = { msg: `Cannot find todo ${c.params.id}` }
        return
    }

    response.body = { msg: 'OK' }
    response.status = 200
}

export const getHome = (c: RouterContext) => {
    c.response.body = 'Deno API server is running...'
    c.response.status = 200
}

export const router = new Router()
router
    .get('/', getHome)
    .get('/todos', getTodos)
    .get('/todos/:id', getTodo)
    .post('/todos', addTodo)
    .put('/todos/:id', updateTodo)
    .delete('/todos/:id', removeTodo)