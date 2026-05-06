// Общие TypeScript-контракты для client API.
// Эти типы описывают payload запросов и shape response.data от backend.

export type ApiFieldError = {
    path: string
    message: string
}

// Универсальный формат ошибки API.
// errors обычно приходит при ошибках валидации полей.
export type ApiErrorResponse = {
    message: string
    errors?: ApiFieldError[]
}

// Публичная часть user, которую можно показывать в UI и возвращать после auth.
export type UserPublic = {
    id: string
    email: string
    name: string
}

// Полный профиль текущего пользователя из GET /auth/me.
export type UserProfile = UserPublic & {
    createdAt: string
    updatedAt: string
}

// Payload для POST /auth/login.
export type AuthLoginRequest = {
    email: string
    password: string
}

// Response после login/register: token сохраняется в localStorage, user идет в состояние приложения.
export type AuthResponse = {
    token: string
    user: UserPublic
}

// Payload для POST /auth/register.
export type AuthRegisterRequest = {
    email: string
    password: string
    name: string
}

// Основной DTO события, который backend возвращает в списках и detail-страницах.
export type EventDto = {
    id: string
    title: string
    description: string
    capacity: number
    address: string
    startedAt: string
    ownerId: string
    createdAt: string
    updatedAt: string
}

// Payload для POST /events.
export type CreateEventRequest = {
    title: string
    description: string
    capacity: number
    address: string
    startedAt: string
}

// Payload для PATCH /events/:id: можно отправлять только изменившиеся поля.
export type UpdateEventRequest = Partial<CreateEventRequest>

// Response после записи пользователя на событие.
export type JoinEventResponse = {
    message: string
    participation: {
        id: string
        eventId: string
        userId: string
        joinedAt: string
    }
}


// Элемент списка GET /me/events/joined: дата записи + само событие.
export type JoinedEventItem = {
    joinedAt: string
    event: EventDto
}
