import axiosInstance from './client';

export const getNurse = async (nurseId: number) =>
  (await axiosInstance.get<Nurse>(`/nurses/${nurseId}`)).data;

export type CreateNurseDTO = Pick<Nurse, 'name' | 'phoneNum' | 'gender' | 'isWorker'>;

export const createAccountNurse = async (accountId: number, createNurse: CreateNurseDTO) =>
  (
    await axiosInstance.post<Nurse>(`/nurses?accountId=${accountId}`, {
      ...createNurse,
      phoneNum: createNurse.phoneNum.replace(/-+/g, ''),
    })
  ).data;

export type UpdateNurseDTO = Pick<
  Nurse,
  | 'name'
  | 'phoneNum'
  | 'gender'
  | 'isWorker'
  | 'employmentDate'
  | 'isDutyManager'
  | 'isWardManager'
  | 'memo'
>;
export const updateNurse = async (nurseId: number, updatedNurse: UpdateNurseDTO) =>
  (await axiosInstance.patch<Nurse>(`/nurses/${nurseId}`, updatedNurse)).data;
