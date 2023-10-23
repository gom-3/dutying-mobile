import { devtools } from 'zustand/middleware';
import { shallow } from 'zustand/shallow';
import { createWithEqualityFn } from 'zustand/traditional';

export type ShiftWithoutID = Omit<Shift, 'accountShiftTypeId'>;

interface State {
  currentShift: ShiftWithoutID;
  accountShiftTypeId: number;
  isEdit: boolean;
}

const randomHexColor = () => {
  let letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) color += letters[Math.floor(Math.random() * 16)];
  return color;
};

const initialShift = (): ShiftWithoutID => {
  return {
    name: '',
    shortName: '',
    startTime: null,
    endTime: null,
    classification: 'OTHER_WORK',
    isDefault: false,
    color: randomHexColor(),
    isAlarm: false,
    alarmInfoList: [],
  };
};

interface Store extends State {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setState: (key: keyof State, value: any) => void;
  initShift: () => void;
  editShift: (shift: ShiftWithoutID, id: number) => void;
}

export const useEditShiftTypeStore = createWithEqualityFn<Store>()(
  devtools(
    (set, _) => ({
      currentShift: initialShift(),
      accountShiftTypeId: 0,
      isEdit: false,
      setState: (state, value) => set((prev) => ({ ...prev, [state]: value })),
      initShift: () => set((prev) => ({ ...prev, currentShift: initialShift(), isEdit: false })),
      editShift: (shift, id) =>
        set(() => ({ currentShift: shift, accountShiftTypeId: id, isEdit:true })),
    }),
    { name: 'useEditShiftTypeStore' },
  ),
  shallow,
);
