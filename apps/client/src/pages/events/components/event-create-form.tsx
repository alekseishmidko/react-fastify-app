import { useEventsStore } from '@/stores/events.store';
import { useNavigate } from 'react-router-dom';
import { EventForm } from './event-form';

type Props = {
  className?: string;
};

export function EventCreateForm({ className }: Props) {
  const navigate = useNavigate();
  const createEvent = useEventsStore((s) => s.createEvent);
  const mutationLoading = useEventsStore((s) => s.mutationLoading);
  const eventsError = useEventsStore((s) => s.evetnsError);

  return (
    <EventForm
      className={className}
      title="Создать событие"
      subtitle="Заполните поля события"
      batckTo="/events"
      backLabel="Назад"
      cancelTo="/events"
      submitLabel="Создать событие"
      submittingLabel="Создание.."
      error={eventsError}
      loading={mutationLoading}
      onSublit={async (values) => {
        const created = await createEvent(values);
        navigate(`/events/${created.id}`, { replace: true });
      }}
    />
  );
}
