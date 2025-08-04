/**
 * Todo model class
 */
export class Todo {
    constructor(id, text, completed = false, createdAt = new Date()) {
        this.id = id;
        this.text = text;
        this.completed = completed;
        this.createdAt = createdAt instanceof Date ? createdAt : new Date(createdAt);
    }

    /**
     * Create a new Todo instance from plain object
     */
    static fromObject(obj) {
        return new Todo(obj.id, obj.text, obj.completed, obj.createdAt);
    }

    /**
     * Convert Todo instance to plain object
     */
    toObject() {
        return {
            id: this.id,
            text: this.text,
            completed: this.completed,
            createdAt: this.createdAt.toISOString(),
        };
    }

    /**
     * Generate a new unique ID
     */
    static generateId() {
        return Date.now().toString() + Math.random().toString(36).substr(2, 9);
    }

    /**
     * Create a new Todo with generated ID
     */
    static create(text) {
        return new Todo(Todo.generateId(), text);
    }
}
