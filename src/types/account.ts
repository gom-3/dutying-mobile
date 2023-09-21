type Account = {
  accountId: number;
  nurseId: number;
  wardId: number;
  shiftTeamId: number;
  email: string;
  name: string;
  isManager: boolean;
  profileImgBase64: string;
  status: 'ACTIVE' | 'INITIAL';
};
