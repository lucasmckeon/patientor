import { useParams } from 'react-router-dom';
import { Patient } from '../../types';
import { findById } from '../../services/patients';
import { useEffect, useState } from 'react';

const PatientPage = () => {
  const { patientId } = useParams();
  const [patient, setPatient] = useState<Patient | null>(null);
  useEffect(() => {
    if (!patient) {
      if (!patientId) throw Error('PatientPage needs a patient id to render');
      const fetchPatient = async () => {
        const p = await findById(patientId);
        setPatient(p);
      };
      fetchPatient();
    }
  }, [patientId, patient]);

  return patient ? (
    <div>
      <h3>{patient.name}</h3>
      <p>ssh:{patient.ssn}</p>
      <p>occupation:{patient.occupation}</p>
    </div>
  ) : (
    <div>Loading...</div>
  );
};
export default PatientPage;
