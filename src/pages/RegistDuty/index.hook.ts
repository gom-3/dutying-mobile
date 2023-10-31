import { DateType } from '@pages/HomePage/components/Calendar';
import { useShiftTypeStore } from 'store/shift';
import { useEffect, useMemo, useState } from 'react';
import { useCaledarDateStore } from 'store/calendar';
import { isSameDate } from '@libs/utils/date';
import { useLinkProps, useNavigation } from '@react-navigation/native';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  AccountShiftListRequestDTO,
  AccountShiftRequest,
  editAccountShiftList,
  getAccountShiftList,
} from '@libs/api/shift';
import { useAccountStore } from 'store/account';
import { firebaseLogEvent } from '@libs/utils/event';
import { useEditShiftTypeStore } from '@pages/ShiftTypePage/store';

const useRegistDuty = (dateFrom?: string) => {
  const [date, calendar, setState] = useCaledarDateStore((state) => [
    state.date,
    state.calendar,
    state.setState,
  ]);
  const [userId] = useAccountStore((state) => [state.account.accountId]);
  const [shiftTypes] = useShiftTypeStore((state) => [state.shiftTypes]);
  const [tempCalendar, setTempCalendar] = useState<DateType[]>(calendar);
  const [editShift] = useEditShiftTypeStore((state) => [state.editShift]);
  const { onPress: navigateToEidtShiftType } = useLinkProps({ to: { screen: 'ShiftTypeEdit' } });
  const { onPress: navigateToShiftType } = useLinkProps({ to: { screen: 'ShiftType' } });
  const [index, setIndex] = useState(
    calendar.findIndex((t) =>
      isSameDate(
        t.date,
        dateFrom ? new Date(dateFrom) : new Date(date.getFullYear(), date.getMonth(), 1),
      ),
    ),
  );
  const navigation = useNavigation();
  const queryClient = useQueryClient();

  const shiftTypeButtons = useMemo(() => {
    const array: (Shift | null)[] = Array.from(shiftTypes.values());
    const result: (Shift | null)[][] = [];

    for (let i = 0; i < array.length; i += 4) {
      let chunk = array.slice(i, i + 4);
      if (chunk.length < 4) chunk = chunk.concat(Array.from({ length: 4 - chunk.length }, () => null));
      result.push(chunk);
    }
    return result;
  }, []);

  const { mutate: editAccountShiftListMutate } = useMutation(
    (shiftList: AccountShiftListRequestDTO) => editAccountShiftList(userId, shiftList),
    {
      onSuccess: () => {
        setState('isSideMenuOpen', false);
        setState('calendar', [...tempCalendar]);
        navigation.goBack();
        queryClient.invalidateQueries([
          'getAccountShiftList',
          userId,
          date.getFullYear(),
          date.getMonth(),
        ]);
      },
    },
  );

  const getAccountShiftListKey = [
    'getAccountShiftList',
    userId,
    date.getFullYear(),
    date.getMonth(),
  ];

  const { data: shiftListResponse } = useQuery(getAccountShiftListKey, () =>
    getAccountShiftList(userId, date.getFullYear(), date.getMonth()),
  );

  const longPressShift = (shift: Shift) => {
    const { accountShiftTypeId, ...shiftWithoutId } = shift;
    editShift(shiftWithoutId, accountShiftTypeId);
    navigateToEidtShiftType();
  };

  const registCalendar = useMemo(() => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const first = new Date(year, month, 1);
    const last = new Date(year, month + 1, 0);
    const calendar: DateType[] = [];
    let dateIndex = 0;
    if (shiftListResponse) {
      const shiftList = shiftListResponse.accountShiftTypeIdList;
      for (let i = first.getDay() - 1; i >= 0; i--) {
        const date: DateType = {
          date: new Date(year, month, -i),
          shift: shiftList[dateIndex++],
          schedules: [],
        };
        calendar.push(date);
      }
      for (let i = 1; i <= last.getDate(); i++) {
        const date: DateType = {
          date: new Date(year, month, i),
          shift: shiftList[dateIndex++],
          schedules: [],
        };
        calendar.push(date);
      }
      for (let i = last.getDay(), j = 1; i < 6; i++, j++) {
        const date: DateType = {
          date: new Date(year, month + 1, j),
          shift: shiftList[dateIndex++],
          schedules: [],
        };
        calendar.push(date);
      }
    }
    return calendar;
  }, [shiftListResponse]);

  const selectedDate = tempCalendar[index] && tempCalendar[index].date;

  const weeks = useMemo(() => {
    const weeks = [];
    const temp = [...tempCalendar];
    while (temp.length > 0) weeks.push(temp.splice(0, 7));
    return weeks;
  }, [tempCalendar]);

  const shiftTypesCount = useMemo(() => {
    const map = new Map<number, number>();
    tempCalendar.forEach((date) => {
      if (date.shift) {
        const value = map.get(date.shift) || 0;
        map.set(date.shift, value + 1);
      }
    });
    return map;
  }, [tempCalendar]);

  const insertShift = (shift: number) => {
    firebaseLogEvent('insert_shift');
    const newValue: DateType = {
      ...tempCalendar[index],
      shift,
    };
    const newArray = [...tempCalendar];
    newArray[index] = newValue;
    setTempCalendar(newArray);
    if (
      tempCalendar[index + 1] &&
      tempCalendar[index + 1].date.getMonth() === tempCalendar[index].date.getMonth()
    ) {
      setIndex(index + 1);
    }
  };

  const deleteShift = () => {
    firebaseLogEvent('delete_shift');
    const newValue: DateType = {
      ...tempCalendar[index],
      shift: null,
    };
    const newArray = [...tempCalendar];
    newArray[index] = newValue;
    setTempCalendar(newArray);
    if (
      tempCalendar[index - 1] &&
      tempCalendar[index - 1].date.getMonth() === tempCalendar[index].date.getMonth()
    ) {
      setIndex(index - 1);
    }
  };

  const selectDate = (e: Date) => {
    if (e.getMonth() === date.getMonth()) {
      setIndex(tempCalendar.findIndex((t) => isSameDate(t.date, e)));
    }
  };

  const saveRegistDutyChange = () => {
    firebaseLogEvent('regist_shift');
    const accountShiftList: AccountShiftRequest[] = [];

    tempCalendar.forEach((date) => {
      const dateObj = date.date;
      accountShiftList.push({
        shiftDate: `${dateObj.getFullYear()}-${(dateObj.getMonth() + 1)
          .toString()
          .padStart(2, '0')}-${dateObj.getDate().toString().padStart(2, '0')}`,
        accountShiftTypeId: date.shift,
      });
    });
    const requestDTO: AccountShiftListRequestDTO = { accountShifts: accountShiftList };
    editAccountShiftListMutate(requestDTO);
  };

  useEffect(() => {
    setTempCalendar(registCalendar);
  }, [registCalendar]);

  console.log(shiftTypeButtons);

  return {
    state: {
      date,
      weeks,
      selectedDate,
      shiftTypes,
      shiftTypesCount,
      shiftTypeButtons,
    },
    actions: {
      insertShift,
      deleteShift,
      selectDate,
      saveRegistDutyChange,
      navigateToShiftType,
      longPressShift,
    },
  };
};

export default useRegistDuty;
