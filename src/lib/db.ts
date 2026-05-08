export type User = {
    id: number;
    name: string;
};

export const users: Record<number, User> = {
    1: { id: 1, name: "Alice" },
    2: { id: 2, name: "Bob" },
    3: { id: 3, name: "Charlie" },
};