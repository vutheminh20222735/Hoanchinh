export interface Todo {
    id: number;
    text: string;
    completed: boolean;
    createdAt: Date;
    updatedAt: Date;
    priority: 'low' | 'medium' | 'high';
}
