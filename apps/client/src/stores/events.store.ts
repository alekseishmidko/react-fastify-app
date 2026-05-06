import { getApiErrorMessage } from "@/lib/utils";

import type { CreateEventRequest, EventDto, JoinedEventItem, UpdateEventRequest } from "@/shared/api/types";
import { create } from "zustand";
import {eventsApi, meApi} from "@/shared/api";

// Фильтр для экрана "мои события": созданные пользователем или те, где он участник.
export type MyEventsFilter = 'created' | 'joined'

// Zustand store для списка событий, участия пользователя и async-состояний event actions.
type EvetnsState = {
    // Все события из GET /events.
    events: EventDto[]
    // События, на которые текущий пользователь записался через /me/events/joined.
    joinedEvents: JoinedEventItem[]
    myEventsFilter: MyEventsFilter

    // Раздельные loading-флаги позволяют UI независимо показывать загрузку списков и мутаций.
    eventsLoading: boolean
    joinedLoading: boolean
    mutationLoading: boolean
    evetnsError: string | null

    setMyEventsFilter: (fileter: MyEventsFilter) => void
    // Загружает общий список событий.
    loadEvents: () => Promise<void>
    // Загружает список событий, где текущий пользователь участник.
    loadJoinedEvents: () => Promise<void>
    // Mutations вызывают backend и затем синхронизируют локальный Zustand state.
    createEvent: (payload: CreateEventRequest) => Promise<EventDto>
    updateEvent: (id: string, payload: UpdateEventRequest) => Promise<EventDto>
    removeEvent: (id: string) => Promise<void>
    joinEvent: (id: string) => Promise<void>
    leaveEvent: (id: string) => Promise<void>
}

export const useEventsStore = create<EvetnsState>((set, get) => ({
    events: [],
    joinedEvents: [],
    myEventsFilter: 'created',
    eventsLoading: false,
    joinedLoading: false,
    mutationLoading: false,
    evetnsError: null,
    setMyEventsFilter: (filter) => set({ myEventsFilter: filter}),
    loadEvents: async () => {
        // GET /events и кладем результат в основной список.
        set({ eventsLoading: true, evetnsError: null })

        try {
            const list = await eventsApi.list()
            set({ events: list, eventsLoading: false })
        } catch (error) {
            set({
                eventsLoading: false,
                evetnsError: getApiErrorMessage(error, 'Не удалось загрузить события')
            })

            throw error
        }
    },

    loadJoinedEvents: async () => {
        // GET /me/events/joined возвращает не просто EventDto, а joinedAt + event.
        set({ joinedLoading: true, evetnsError: null })

        try {
            const list = await meApi.joinedEvents();
            set({ joinedEvents: list, joinedLoading: false })
        } catch (error) {
            set({
                joinedLoading: false,
                evetnsError: getApiErrorMessage(error, 'Не удалось загрузить участие')
            })

            throw error
        }
    },

    createEvent: async (payload) => {
        // Создаем событие на backend, потом добавляем его в локальный список без полной перезагрузки.
        set({ mutationLoading: true, evetnsError: null })

        try {
            const created = await eventsApi.create(payload)

            // Список сортируется по startedAt, чтобы новое событие сразу встало в правильное место.
            set((s) => ({
                events: [...s.events, created].sort((a,b) => a.startedAt.localeCompare(b.startedAt)),
                mutationLoading: false
            }))

            return created
        } catch (error) {
            set({
                mutationLoading: false,
                evetnsError: getApiErrorMessage(error, 'Не удалось создать событие')
            })

            throw error
        }
    },

    updateEvent: async (id, payload) => {
        // Обновляем событие и заменяем его во всех локальных списках, где оно может присутствовать.
        set({ mutationLoading: true, evetnsError: null })

        try {
            const updated = await eventsApi.update(id, payload);

            set((s) => ({
                // Основной список хранит EventDto напрямую.
                events: s.events
                    .map(event => event.id === id ? updated : event)
                    .sort((a,b) => a.startedAt.localeCompare(b.startedAt)),
                // joinedEvents хранит объект-обертку, поэтому обновляем вложенное row.event.
                joinedEvents: s.joinedEvents
                    .map(row => row.event.id === id ? { ...row, event: updated} : row),
                mutationLoading: false
            }))

            return updated
        } catch (error) {
            set({
                mutationLoading: false,
                evetnsError: getApiErrorMessage(error, 'Не удалось обновить событие')
            })

            throw error
        }
    },

    removeEvent: async (id) => {
        // После удаления на backend убираем событие из всех локальных списков.
        set({ mutationLoading: true, evetnsError: null })

        try {
            await eventsApi.remove(id)

            set((s) => ({
                events: s.events.filter(event => event.id !== id),
                joinedEvents: s.joinedEvents.filter(row => row.event.id !== id),
                mutationLoading: false
            }))
        } catch (error) {
            set({
                mutationLoading: false,
                evetnsError: getApiErrorMessage(error, 'Не удалось удалить событие')
            })

            throw error
        }
    },

    joinEvent: async (id) => {
        // Записываем пользователя на событие, затем перезагружаем joinedEvents,
        // потому что backend возвращает participation, а экрану нужен JoinedEventItem.
        set({ mutationLoading: true, evetnsError: null })

        try {
            await eventsApi.join(id);
            await get().loadJoinedEvents();
            set({ mutationLoading: false})
        } catch (error) {
            set({
                mutationLoading: false,
                evetnsError: getApiErrorMessage(error, 'Не удалось прислоединиться')
            })

            throw error
        }
    },

    leaveEvent: async (id) => {
        // Отменяем участие и локально удаляем событие из joinedEvents.
        set({ mutationLoading: true, evetnsError: null })

        try {
            await eventsApi.leave(id);

            set((s) => ({
                joinedEvents: s.joinedEvents.filter(row => row.event.id !== id),
                mutationLoading: false
            }))
        } catch (error) {
            set({
                mutationLoading: false,
                evetnsError: getApiErrorMessage(error, 'Не удалось выйти из события')
            })

            throw error
        }
    }

}))
