import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { Todo } from '@/models/Todo';

const TODOS_FILE_PATH = path.join(process.cwd(), 'data', 'todos.json');

/**
 * Read todos from JSON file
 */
async function readTodos() {
    try {
        const data = await fs.readFile(TODOS_FILE_PATH, 'utf8');
        const todosData = JSON.parse(data);
        return todosData.map(todo => Todo.fromObject(todo));
    } catch (error) {
        if (error.code === 'ENOENT') {
            return [];
        }
        throw error;
    }
}

/**
 * Write todos to JSON file
 */
async function writeTodos(todos) {
    const todosData = todos.map(todo => todo.toObject());
    await fs.writeFile(TODOS_FILE_PATH, JSON.stringify(todosData, null, 2));
}

/**
 * GET /api/todos - Get all todos
 */
export async function GET() {
    try {
        const todos = await readTodos();
        return NextResponse.json(todos.map(todo => todo.toObject()));
    } catch (error) {
        console.error('Error reading todos:', error);
        return NextResponse.json(
            { error: 'Failed to read todos' },
            { status: 500 }
        );
    }
}

/**
 * POST /api/todos - Create a new todo
 */
export async function POST(request) {
    try {
        const { text } = await request.json();

        if (!text || typeof text !== 'string' || text.trim() === '') {
            return NextResponse.json(
                { error: 'Todo text is required' },
                { status: 400 }
            );
        }

        const todos = await readTodos();
        const newTodo = Todo.create(text.trim());
        todos.push(newTodo);

        await writeTodos(todos);

        return NextResponse.json(newTodo.toObject(), { status: 201 });
    } catch (error) {
        console.error('Error creating todo:', error);
        return NextResponse.json(
            { error: 'Failed to create todo' },
            { status: 500 }
        );
    }
}

/**
 * PUT /api/todos - Update all todos (bulk operations)
 */
export async function PUT(request) {
    try {
        const { todos: todosData } = await request.json();

        if (!Array.isArray(todosData)) {
            return NextResponse.json(
                { error: 'Todos must be an array' },
                { status: 400 }
            );
        }

        const todos = todosData.map(todo => Todo.fromObject(todo));
        await writeTodos(todos);

        return NextResponse.json(todos.map(todo => todo.toObject()));
    } catch (error) {
        console.error('Error updating todos:', error);
        return NextResponse.json(
            { error: 'Failed to update todos' },
            { status: 500 }
        );
    }
}

/**
 * DELETE /api/todos - Delete all todos
 */
export async function DELETE() {
    try {
        await writeTodos([]);
        return NextResponse.json({ message: 'All todos deleted' });
    } catch (error) {
        console.error('Error deleting todos:', error);
        return NextResponse.json(
            { error: 'Failed to delete todos' },
            { status: 500 }
        );
    }
}
