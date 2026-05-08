import { getApiErrorMessage } from '@/lib/utils';
import { eventsApi } from '@/shared/api/events.api';
import { isAxiosError } from '@/shared/api/http';
import type { EventDto } from '@/shared/api/types';
import { useEventsStore } from '@/stores/events.store';
import { useEffect, useState } from 'react';

type UseEventByIdOptions = {
  prefetchJoinedEvents?: boolean;
};

export function useEventById(id: string | undefined, options?: UseEventByIdOptions) {
  const prefetchJoinedEvents = options?.prefetchJoinedEvents ?? false;
  const loadJoinedEvents = useEventsStore((s) => s.loadJoinedEvents);

  const [event, setEvent] = useState<EventDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    if (!id) {
      setEvent(null);
      setLoading(false);
      setNotFound(false);
      setLoadError(null);

      return () => {
        cancelled = true;
      };
    }

    const loadEvent = async () => {
      setLoading(true);
      setNotFound(false);
      setLoadError(null);

      try {
        const [event] = await Promise.all([
          eventsApi.getById(id),
          prefetchJoinedEvents
            ? loadJoinedEvents().catch(() => undefined)
            : Promise.resolve(undefined),
        ]);

        if (!cancelled) {
          setEvent(event);
        }
      } catch (error) {
        if (cancelled) return;

        if (isAxiosError(error) && error.response?.status === 404) {
          setNotFound(true);

          return;
        }

        setLoadError(getApiErrorMessage(error, 'Не удалось загрузить событие'));
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadEvent();

    return () => {
      cancelled = true;
    };
  }, [id, loadJoinedEvents, prefetchJoinedEvents]);

  return { event, loadError, loading, notFound };
}
