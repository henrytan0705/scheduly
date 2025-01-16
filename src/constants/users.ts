export interface User {
    id: string;
    name: string;
    role: "coach" | "student";
    phoneNumber: string
}

export const coachMockUser: User = {
    id: "18395c1e-1dd5-411f-9f85-fef08cbff259",
    name: "Henry Tan",
    role: "coach",
    phoneNumber: '1-234-567-8910'
}

export const studentMockUser: User = {
    id: "4d4daf41-c243-4bcb-8b4f-f676719ddd8a",
    name: "John Smith",
    role: "student",
    phoneNumber: '1-222-333-4444'
}