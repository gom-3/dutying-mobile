type Account = {
  accountId: number;
  nurseId: number;
  wardId: number;
  shiftTeamId: number;
  email: string;
  name: string;
  isManager: boolean;
  profileImgBase64: string;
  status:
    | 'INITIAL'
    | 'NURSE_INFO_PENDING'
    | 'WARD_SELECT_PENDING'
    | 'WARD_ENTRY_PENDING'
    | 'LINKED'
    | 'DEMO';
};
