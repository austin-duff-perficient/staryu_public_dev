'use client';

import { useState } from 'react';

/**
 * Individual todo item component
 */
export function TodoItem({ todo, onUpdate, onDelete, onToggle }) {
    const [isEditing, setIsEditing] = useState(false);
    const [editText, setEditText] = useState(todo.text);

    const handleEdit = () => {
        setIsEditing(true);
        setEditText(todo.text);
    };

    const handleSave = () => {
        if (editText.trim() && editText.trim() !== todo.text) {
            onUpdate(todo.id, { text: editText.trim() });
        }
        setIsEditing(false);
    };

    const handleCancel = () => {
        setEditText(todo.text);
        setIsEditing(false);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSave();
        } else if (e.key === 'Escape') {
            handleCancel();
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <div className={`group flex items-center gap-3 p-4 bg-white rounded-lg shadow-sm border transition-all duration-200 hover:shadow-md ${todo.completed ? 'opacity-75 bg-gray-50' : ''
            }`}>
            {/* Checkbox */}
            <button
                onClick={() => onToggle(todo.id)}
                className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors duration-200 ${todo.completed
                        ? 'bg-green-500 border-green-500 text-white'
                        : 'border-gray-300 hover:border-green-400'
                    }`}
            >
                {todo.completed && (
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                )}
            </button>

            {/* Todo content */}
            <div className="flex-1 min-w-0">
                {isEditing ? (
                    <input
                        type="text"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        onBlur={handleSave}
                        onKeyDown={handleKeyPress}
                        className="w-full px-2 py-1 text-gray-900 bg-white border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        autoFocus
                    />
                ) : (
                    <div>
                        <p className={`text-gray-900 ${todo.completed ? 'line-through text-gray-500' : ''}`}>
                            {todo.text}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                            Created {formatDate(todo.createdAt)}
                        </p>
                    </div>
                )}
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                {!isEditing && !todo.completed && (
                    <button
                        onClick={handleEdit}
                        className="p-1 text-gray-400 hover:text-blue-500 transition-colors duration-200"
                        title="Edit todo"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                    </button>
                )}

                <button
                    onClick={() => onDelete(todo.id)}
                    className="p-1 text-gray-400 hover:text-red-500 transition-colors duration-200"
                    title="Delete todo"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                </button>
            </div>
        </div>
    );
}
