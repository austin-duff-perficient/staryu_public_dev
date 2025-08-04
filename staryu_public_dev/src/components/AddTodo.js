'use client';

import { useState } from 'react';

/**
 * Add new todo component
 */
export function AddTodo({ onAdd }) {
    const [text, setText] = useState('');
    const [isAdding, setIsAdding] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!text.trim()) {
            return;
        }

        try {
            setIsAdding(true);
            await onAdd(text.trim());
            setText('');
        } catch (error) {
            console.error('Error adding todo:', error);
        } finally {
            setIsAdding(false);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border p-4">
            <form onSubmit={handleSubmit} className="flex gap-3">
                <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="What needs to be done?"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={isAdding}
                />
                <button
                    type="submit"
                    disabled={!text.trim() || isAdding}
                    className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                    {isAdding ? (
                        <div className="flex items-center gap-2">
                            <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            Adding...
                        </div>
                    ) : (
                        'Add Todo'
                    )}
                </button>
            </form>
        </div>
    );
}
