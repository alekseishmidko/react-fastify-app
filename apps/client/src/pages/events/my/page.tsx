import { PageShell } from '@/components/page-shell';
import { useAuthStore } from '@/stores/auth.store';
import { useEventsStore } from '@/stores/events.store';
import { useEffect } from 'react';
import { MyEventsTitle } from '../components/my-events-stat-title';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CreatedEventsTable } from '../components/created-events-table';
import { JoinedEventsTable } from '../components/joined-events-table';

export function EventsMyPage() {
  const user = useAuthStore((s) => s.user);
  const events = useEventsStore((s) => s.events);
  const joinedEvents = useEventsStore((s) => s.joinedEvents);
  const myEventsFilter = useEventsStore((s) => s.myEventsFilter);
  const setMyEventsFilter = useEventsStore((s) => s.setMyEventsFilter);
  const loadEvents = useEventsStore((s) => s.loadEvents);
  const loadJoinedEvents = useEventsStore((s) => s.loadJoinedEvents);
  const eventsLoading = useEventsStore((s) => s.eventsLoading);
  const joinedLoading = useEventsStore((s) => s.joinedLoading);
  const eventsError = useEventsStore((s) => s.evetnsError);

  useEffect(() => {
    Promise.all([loadEvents(), loadJoinedEvents()]);
  }, [loadEvents, loadJoinedEvents]);

  const createdList = () => {
    if (!user) return [];
    return events
      .filter((e) => e.ownerId === user.id)
      .sort((a, b) => a.startedAt.localeCompare(b.startedAt));
  };

  const createdCount = createdList().length;
  const joinedCount = joinedEvents.length;

  return (
    <PageShell title="Мои события">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <div className="grid grid-cols-2 gap-3 sm:max-w-md">
          <MyEventsTitle label="Создано" value={createdCount} />
          <MyEventsTitle label="Участвую" value={joinedCount} />
        </div>

        {eventsError && <p>Ошибка загрузки: {eventsError}</p>}

        <Tabs
          value={myEventsFilter}
          onValueChange={(v) => {
            if (v === 'created' || v === 'joined') {
              setMyEventsFilter(v);
            }
          }}
          className="gap-4"
        >
          <TabsList className="w-full max-w-md gap-4">
            <TabsTrigger value="created" className="flex-1">
              Созданные
            </TabsTrigger>
            <TabsTrigger value="joined" className="flex-1">
              Участвую
            </TabsTrigger>
          </TabsList>

          <TabsContent value="created" className="mt-0">
            {eventsLoading ? (
              'Загрузка'
            ) : createdList().length === 0 ? (
              'Нету событий'
            ) : (
              <CreatedEventsTable events={createdList()} />
            )}
          </TabsContent>

          <TabsContent value="joined" className="mt-0">
            {joinedLoading ? (
              'Загрузка'
            ) : joinedEvents.length === 0 ? (
              'Нету событий в которых вы участвуйте'
            ) : (
              <JoinedEventsTable rows={joinedEvents} />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </PageShell>
  );
}
