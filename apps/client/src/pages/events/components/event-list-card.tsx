import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { formatStartsAt } from '@/lib/utils';
import type { EventDto } from '@/shared/api/types';
import { Link } from 'react-router-dom';

type Props = {
  event: EventDto;
};

export function EventListCard({ event }: Props) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-base">
          <Link className="hove:text-primary hover:underline" to={`/events/${event.id}`}>
            {event.title}
          </Link>
        </CardTitle>

        <CardDescription>
          {formatStartsAt(event.startedAt)} - {event.address}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="line-clamp-3 text-muted-foreground">{event.description || '-'}</p>
      </CardContent>
      <CardFooter className="mt-auto justify-between pt-4">
        <span className="text-muted-foreground">До {event.capacity} чел.</span>
        <Button asChild variant="outline" size="sm">
          <Link to={`/events/${event.id}`}>Подробнее</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
