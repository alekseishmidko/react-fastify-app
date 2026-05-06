import { http } from "./http";
import type { JoinedEventItem } from "./types";

// Методы для endpoints /me/*: данные, связанные с текущим авторизованным пользователем.
export const meApi = {
    // GET /me/events/joined: события, на которые текущий пользователь уже записался.
    async joinedEvents(): Promise<JoinedEventItem[]> {
        const { data } = await http.get<JoinedEventItem[]>('/me/events/joined')

        return data
    }
}
