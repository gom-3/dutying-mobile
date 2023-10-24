import { useQuery } from '@tanstack/react-query';
import { getShiftTypes } from '@libs/api/shiftTypes';
import { useEffect } from 'react';
import { useShiftTypeStore } from 'store/shift';
import { useAccountStore } from 'store/account';

const useShiftType = () => {
  const [userId] = useAccountStore((state) => [state.account.accountId]);
  const { data: shiftTypesResponse } = useQuery(
    ['getShiftTypes', userId],
    () => getShiftTypes(userId),
    {
      enabled: userId > 0,
    },
  );
  const [setState] = useShiftTypeStore((state) => [state.setState]);
  useEffect(() => {
    const shiftTypes = new Map<number, Shift>();
    shiftTypesResponse?.shiftTypes?.filter((type) =>
      shiftTypes.set(type.accountShiftTypeId, {
        ...type,
        startTime: type.startTime ? new Date(`2023-12-31T${type.startTime}:00`) : null,
        endTime: type.endTime ? new Date(`2023-12-31T${type.endTime}:00`) : null,
      }),
    );
    setState('shiftTypes', shiftTypes);
  }, [shiftTypesResponse]);
};

export default useShiftType;
