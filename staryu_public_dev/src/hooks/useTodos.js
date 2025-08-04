'use client';

import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook for managing todos
 */
export function useTodos() {
    const [todos, setTodos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    /**
     * Fetch todos from the API
     */
    const fetchTodos = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch('/api/todos');
            if (!response.ok) {
                throw new Error('Failed to fetch todos');
            }

            const todosData = await response.json();
            setTodos(todosData);
        } catch (err) {
            setError(err.message);
            console.error('Error fetching todos:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Add a new todo
     */
    const addTodo = useCallback(async (text) => {
        try {
            setError(null);

            const response = await fetch('/api/todos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text }),
            });

            if (!response.ok) {
                throw new Error('Failed to add todo');
            }

            const newTodo = await response.json();
            setTodos(prev => [...prev, newTodo]);
            return newTodo;
        } catch (err) {
            setError(err.message);
            console.error('Error adding todo:', err);
            throw err;
        }
    }, []);

    /**
     * Update a todo
     */
    const updateTodo = useCallback(async (id, updates) => {
        try {
            setError(null);

            // Optimistically update the UI
            setTodos(prev => prev.map(todo =>
                todo.id === id ? { ...todo, ...updates } : todo
            ));

            // Update all todos on the server
            const updatedTodos = todos.map(todo =>
                todo.id === id ? { ...todo, ...updates } : todo
            );

            const response = await fetch('/api/todos', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ todos: updatedTodos }),
            });

            if (!response.ok) {
                // Revert the optimistic update on error
                setTodos(prev => prev.map(todo =>
                    todo.id === id ? todos.find(t => t.id === id) : todo
                ));
                throw new Error('Failed to update todo');
            }

            const serverTodos = await response.json();
            setTodos(serverTodos);
        } catch (err) {
            setError(err.message);
            console.error('Error updating todo:', err);
        }
    }, [todos]);

    /**
     * Delete a todo
     */
    const deleteTodo = useCallback(async (id) => {
        try {
            setError(null);

            // Optimistically update the UI
            const todoToDelete = todos.find(todo => todo.id === id);
            setTodos(prev => prev.filter(todo => todo.id !== id));

            // Update all todos on the server
            const updatedTodos = todos.filter(todo => todo.id !== id);

            const response = await fetch('/api/todos', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ todos: updatedTodos }),
            });

            if (!response.ok) {
                // Revert the optimistic update on error
                setTodos(prev => [...prev, todoToDelete]);
                throw new Error('Failed to delete todo');
            }

            const serverTodos = await response.json();
            setTodos(serverTodos);
        } catch (err) {
            setError(err.message);
            console.error('Error deleting todo:', err);
        }
    }, [todos]);

    /**
     * Toggle todo completion status
     */
    const toggleTodo = useCallback((id) => {
        const todo = todos.find(t => t.id === id);
        if (todo) {
            updateTodo(id, { completed: !todo.completed });
        }
    }, [todos, updateTodo]);

    /**
     * Clear all completed todos
     */
    const clearCompleted = useCallback(async () => {
        try {
            setError(null);

            const activeTodos = todos.filter(todo => !todo.completed);

            const response = await fetch('/api/todos', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ todos: activeTodos }),
            });

            if (!response.ok) {
                throw new Error('Failed to clear completed todos');
            }

            const serverTodos = await response.json();
            setTodos(serverTodos);
        } catch (err) {
            setError(err.message);
            console.error('Error clearing completed todos:', err);
        }
    }, [todos]);

    // Load todos on mount
    useEffect(() => {
        fetchTodos();
    }, [fetchTodos]);

    return {
        todos,
        loading,
        error,
        addTodo,
        updateTodo,
        deleteTodo,
        toggleTodo,
        clearCompleted,
        refetch: fetchTodos,
    };
}
