import { useAuthStore } from '@/stores/auth.store';
import { useEventsStore } from '@/stores/events.store';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { useEventById } from '../hooks/use-events-by-id';
import { cn, DATETIME_LOCAL_INPUT_FORMAT } from '@/lib/utils';
import { format, isValid, parseISO } from 'date-fns';
import { EventForm } from './event-form';

type Props = {
  className?: string;
};

export function EventEditForm({ className }: Props) {
  const { id } = useParams<{ id: string }>();
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();
  const updateEvent = useEventsStore((s) => s.updateEvent);
  const mutationLoading = useEventsStore((s) => s.mutationLoading);
  const eventsError = useEventsStore((s) => s.evetnsError);

  const { event, loadError, loading, notFound } = useEventById(id);

  if (!id) {
    return <Navigate to="/events" replace />;
  }

  if (loading) {
    return <div className={cn('mx-auto w-full max-w-2xl space-y-6', className)}>Загрузка</div>;
  }

  if (notFound) {
    return (
      <div className={cn('mx-auto w-full max-w-2xl space-y-6', className)}>
        <p className="text-sm">Событие не найдено</p>
      </div>
    );
  }

  if (loadError || !event) {
    return (
      <div className={cn('mx-auto w-full max-w-2xl space-y-6', className)}>
        <p className="text-sm">Ошибка загрузки</p>
      </div>
    );
  }

  if (!user || event?.ownerId !== user.id) {
    return (
      <div className={cn('mx-auto w-full max-w-2xl space-y-6', className)}>
        <p className="text-sm">Редактировать может только организатор</p>
      </div>
    );
  }

  const startedAtParsed = parseISO(event.startedAt);
  const startedAtForInput = isValid(startedAtParsed)
    ? format(startedAtParsed, DATETIME_LOCAL_INPUT_FORMAT)
    : '';

  return (
    <EventForm
      key={event.id}
      className={className}
      title="Редактировать событие"
      subtitle="Измените поля и сохраните"
      batckTo={`/events/${event.id}`}
      backLabel="Назад к событию"
      cancelTo={`/events/${event.id}`}
      submitLabel="Сохранить"
      submittingLabel="Сохранение..."
      inputValues={{
        title: event.title,
        description: event.description,
        address: event.address,
        capacity: event.capacity,
        startedAt: startedAtForInput,
      }}
      error={eventsError}
      loading={mutationLoading}
      onSublit={async (values) => {
        await updateEvent(event.id, values);
        navigate(`/events/${event.id}`, { replace: true });
      }}
    />
  );
}
