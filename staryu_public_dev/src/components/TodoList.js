'use client';

import { useTodos } from '@/hooks/useTodos';
import { AddTodo } from './AddTodo';
import { TodoItem } from './TodoItem';

/**
 * Main todo list component
 */
export function TodoList() {
    const {
        todos,
        loading,
        error,
        addTodo,
        updateTodo,
        deleteTodo,
        toggleTodo,
        clearCompleted,
    } = useTodos();

    const activeTodos = todos.filter(todo => !todo.completed);
    const completedTodos = todos.filter(todo => todo.completed);

    if (loading) {
        return (
            <div className="max-w-2xl mx-auto p-6">
                <div className="text-center py-12">
                    <div className="inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="mt-4 text-gray-600">Loading todos...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-2xl mx-auto p-6">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                    <svg className="w-12 h-12 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.860-.833-2.5 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    <h3 className="text-lg font-medium text-red-800 mb-2">Error</h3>
                    <p className="text-red-600">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto p-6">
            {/* Header */}
            <div className="mb-8 text-center">
                <h1 className="text-4xl font-bold text-gray-900 mb-2">Todo List</h1>
                <p className="text-gray-600">Stay organized and get things done</p>
            </div>

            {/* Add Todo */}
            <div className="mb-8">
                <AddTodo onAdd={addTodo} />
            </div>

            {/* Stats */}
            {todos.length > 0 && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-center text-sm text-gray-600">
                        <span>{activeTodos.length} active, {completedTodos.length} completed</span>
                        {completedTodos.length > 0 && (
                            <button
                                onClick={clearCompleted}
                                className="text-red-600 hover:text-red-800 transition-colors duration-200"
                            >
                                Clear completed
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* Todo Lists */}
            <div className="space-y-6">
                {/* Active Todos */}
                {activeTodos.length > 0 && (
                    <div>
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">
                            Active ({activeTodos.length})
                        </h2>
                        <div className="space-y-3">
                            {activeTodos.map(todo => (
                                <TodoItem
                                    key={todo.id}
                                    todo={todo}
                                    onUpdate={updateTodo}
                                    onDelete={deleteTodo}
                                    onToggle={toggleTodo}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* Completed Todos */}
                {completedTodos.length > 0 && (
                    <div>
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">
                            Completed ({completedTodos.length})
                        </h2>
                        <div className="space-y-3">
                            {completedTodos.map(todo => (
                                <TodoItem
                                    key={todo.id}
                                    todo={todo}
                                    onUpdate={updateTodo}
                                    onDelete={deleteTodo}
                                    onToggle={toggleTodo}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Empty State */}
            {todos.length === 0 && (
                <div className="text-center py-12">
                    <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    <h3 className="text-xl font-medium text-gray-500 mb-2">No todos yet</h3>
                    <p className="text-gray-400">Add your first todo to get started!</p>
                </div>
            )}
        </div>
    );
}
