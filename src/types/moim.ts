type Moim = {
  moimId: number;
  moimName: string;
  isPublic: boolean;
  hostInfo: Pick<Account, 'accountId' | 'name' | 'profileImgBase64'>;
  memberCount: number;
  memberInfoList: Pick<Account, 'accountId' | 'name' | 'profileImgBase64'>[];
};
