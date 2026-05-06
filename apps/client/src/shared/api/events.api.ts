import { http } from "./http";
import type { CreateEventRequest, EventDto, JoinEventResponse, UpdateEventRequest } from "./types";

// Методы для endpoints /events/*.
// Все запросы проходят через общий http instance, поэтому auth token добавляется автоматически.
export const eventsApi = {
    // GET /events: список доступных событий.
    async list(): Promise<EventDto[]> {
        const { data } = await http.get<EventDto[]>('/events')

        return data
    },
    // GET /events/:id: данные одного события.
    async getById(id: string): Promise<EventDto> {
        const { data } = await http.get<EventDto>(`/events/${id}`)

        return data
    },
    // POST /events: создает событие от имени текущего пользователя.
    async create(payload: CreateEventRequest): Promise<EventDto> {
        const { data } = await http.post<EventDto>(`/events`, payload)

        return data
    },
    // PATCH /events/:id: частично обновляет событие.
    async update(id: string, payload: UpdateEventRequest):Promise<EventDto>  {
        const { data } = await http.patch<EventDto>(`/events/${id}`, payload)

        return data
    },
    // DELETE /events/:id: удаляет событие, если текущий пользователь имеет право.
    async remove(id: string): Promise<void> {
        await http.delete(`/events/${id}`)
    },
    // POST /events/:id/join: записывает текущего пользователя на событие.
    async join(id: string) {
        const { data } = await http.post<JoinEventResponse>(`/events/${id}/join`)

        return data
    },
    // DELETE /events/:id/join: отменяет участие текущего пользователя.
    async leave(id: string):  Promise<void> {
        await http.delete(`/events/${id}/join`)
    }
}
