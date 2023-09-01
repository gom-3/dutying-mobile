type Shift = {
  name: string;
  shortName: string;
  color: string;
  startTime: Date | undefined;
  endTime: Date | undefined;
  type: 'work' | 'off';
  typeDetail: 'day' | 'evening' | 'night' | 'else' | 'off' | 'leave';
};
