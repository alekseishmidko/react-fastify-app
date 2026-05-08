import { ErrorRetryBlock } from '@/components/error-retry-block';
import { PageShell } from '@/components/page-shell';
import { useEventsStore } from '@/stores/events.store';
import { useEffect } from 'react';
import { EventListCard } from '../components/event-list-card';

export function EventsAllPage() {
  const events = useEventsStore((s) => s.events);
  const loadEvents = useEventsStore((s) => s.loadEvents);
  const loading = useEventsStore((s) => s.eventsLoading);
  const error = useEventsStore((s) => s.evetnsError);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  const showInitialLoading = loading && events.length === 0;

  return (
    <PageShell title="Все события">
      {showInitialLoading ? 'Загрузка...' : null}

      {error ? <ErrorRetryBlock className="mb-4" message={error} /> : null}

      {!loading && !error && events.length === 0 ? (
        <p className="text-sm text-muted-foreground">Пока нет событий</p>
      ) : null}

      <ul className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {events.map((event) => (
          <li key={event.id}>
            <EventListCard event={event} />
          </li>
        ))}
      </ul>
    </PageShell>
  );
}
