import { useCaledarDateStore } from 'store/calendar';
import { useFriendStore } from '../../store';
import { getCurrentWeekIndex } from '@libs/utils/date';
import { useQuery } from '@tanstack/react-query';
import { getFriendCollection } from '@libs/api/friend';
import { useMemo } from 'react';

const useCollectionTable = () => {
  const [date] = useCaledarDateStore((state) => [state.date, state.setState]);
  const [weeks] = useFriendStore((state) => [state.weeks]);

  const year = date.getFullYear();
  const month = date.getMonth();
  const currentWeek = getCurrentWeekIndex(date, weeks);

  const { data: collection } = useQuery(['getFriendCollection', year, month], () =>
    getFriendCollection(year, month),
  );

  const sortedCollection = useMemo(() => {
    return collection?.sort((a, b) => (b.isFavorite ? 1 : 0) - (a.isFavorite ? 1 : 0));
  }, [collection]);

  const week = useMemo(() => {
    return weeks.filter((_, i) => i === currentWeek)[0];
  }, [date, weeks]);

  return { states: { week, currentWeek, sortedCollection } };
};

export default useCollectionTable;
