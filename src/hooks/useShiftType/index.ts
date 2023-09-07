import { useQuery } from '@tanstack/react-query';
import { getShiftTypes } from '@libs/api/shiftTypes';
import { useEffect } from 'react';
import { useShiftTypeStore } from 'store/shift';
import { useAccountStore } from 'store/account';

const useShiftType = () => {
  const [userId] = useAccountStore((state) => [state.userId]);
  const { data: shiftTypesResponse } = useQuery(['getShiftTypes', userId], () => getShiftTypes(1));
  const [setState] = useShiftTypeStore((state) => [state.setState]);
  console.log(shiftTypesResponse);
  useEffect(() => {
    const shiftTypes = new Map<number, Shift>();
    shiftTypesResponse?.shiftTypes?.filter((type) =>
      shiftTypes.set(type.accountShiftTypeId, {
        ...type,
        startTime: type.startTime ? new Date(`2023-12-31T${type.startTime}:00`) : undefined,
        endTime: type.endTime ? new Date(`2023-12-31T${type.endTime}:00`) : undefined,
      }),
    );
    if (shiftTypes.size > 0) setState('shiftTypes', shiftTypes);
  }, [shiftTypesResponse]);
};

export default useShiftType;
