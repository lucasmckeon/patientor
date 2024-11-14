import axios from 'axios';
import { Entry, NewEntry, Patient, PatientFormValues } from '../types';

import { apiBaseUrl } from '../constants';

const getAll = async () => {
  const { data } = await axios.get<Patient[]>(`${apiBaseUrl}/patients`);

  return data;
};

const create = async (object: PatientFormValues) => {
  const { data } = await axios.post<Patient>(`${apiBaseUrl}/patients`, object);

  return data;
};

const findById = async (id: string) => {
  const { data } = await axios.get(`${apiBaseUrl}/patients/${id}`);
  return data;
};

const addEntry = async (patientId: string, entry: NewEntry): Promise<Entry> => {
  const { data } = await axios.post<Entry>(
    `${apiBaseUrl}/patients/${patientId}/entries`,
    entry
  );
  return data;
};

export { getAll, create, findById, addEntry };
