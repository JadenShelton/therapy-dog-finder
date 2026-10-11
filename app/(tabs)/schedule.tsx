import { useEffect, useState } from 'react';
import { EmptyView } from '../../src/components/EmptyView';
import { ErrorView } from '../../src/components/ErrorView';
import { LoadingView } from '../../src/components/LoadingView';
import { ScheduleView } from '../../src/components/schedule/ScheduleView';
import { useDog, useSchedule } from '../../src/data';
import { campusClock } from '../../src/domain/status';
import { useUniversity } from '../../src/state';

export default function Schedule() {
  const { university } = useUniversity();
  const dogState = useDog(university?.id);
  const scheduleState = useSchedule(dogState.dog?.id);
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);

  if (dogState.loading || scheduleState.loading) return <LoadingView label="Loading schedule" />;
  const error = dogState.error ?? scheduleState.error;
  if (error) return <ErrorView title="Could not load schedule" message={error.message || 'Something went wrong.'} />;
  if (!dogState.dog || !scheduleState.schedule) {
    return <EmptyView title="No schedule yet" message="There is no therapy dog schedule for this university right now." />;
  }
  const today = campusClock(now, university?.timezone ?? 'UTC').weekday;
  return <ScheduleView schedule={scheduleState.schedule} today={today} />;
}
