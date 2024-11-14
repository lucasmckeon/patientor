import { useParams } from 'react-router-dom';
import {
  HealthCheckEntry,
  HealthCheckRating,
  HospitalEntry,
  OccupationalHealthcareEntry,
  Patient,
} from '../../types';
import { findById } from '../../services/patients';
import { useCallback, useEffect, useState } from 'react';
import { assertNever } from '../../utils';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { green, orange, red, yellow } from '@mui/material/colors';
import { AddHealthCheckEntryForm } from './AddHealthCheckEntryForm';

const HealthCheckEntryElement = ({ entry }: { entry: HealthCheckEntry }) => {
  const getHealthCheckRatingIcon = useCallback(
    (healthCheckRating: HealthCheckRating) => {
      switch (healthCheckRating) {
        case HealthCheckRating.Healthy:
          return <FavoriteIcon style={{ color: green[500] }} />;
        case HealthCheckRating.LowRisk:
          return <FavoriteIcon style={{ color: yellow[200] }} />;
        case HealthCheckRating.HighRisk:
          return <FavoriteIcon style={{ color: orange[400] }} />;
        case HealthCheckRating.CriticalRisk:
          return <FavoriteIcon style={{ color: red[800] }} />;
        default:
          assertNever(healthCheckRating);
      }
    },
    []
  );
  return (
    <div key={entry.id}>
      <p>
        {entry.date} {entry.description}
      </p>
      {getHealthCheckRatingIcon(entry.healthCheckRating)}
      <ul>
        {entry.diagnosisCodes?.map((code) => (
          <li key={code}>{code}</li>
        ))}
      </ul>
    </div>
  );
};
const OccupationalHealthcareEntryElement = ({
  entry,
}: {
  entry: OccupationalHealthcareEntry;
}) => {
  return (
    <div key={entry.id}>
      <p>
        {entry.date} {entry.description}
      </p>
      <ul>
        {entry.diagnosisCodes?.map((code) => (
          <li key={code}>{code}</li>
        ))}
      </ul>
    </div>
  );
};
const HospitalEntryElement = ({ entry }: { entry: HospitalEntry }) => {
  return (
    <div key={entry.id}>
      <p>
        {entry.date} {entry.description}
      </p>
      <ul>
        {entry.diagnosisCodes?.map((code) => (
          <li key={code}>{code}</li>
        ))}
      </ul>
    </div>
  );
};
const PatientPage = () => {
  const { patientId } = useParams();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [showAddHealthCheckEntry, setShowAddHealthCheckEntry] = useState(false);
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
      <button
        onClick={() => setShowAddHealthCheckEntry(!showAddHealthCheckEntry)}
      >
        {showAddHealthCheckEntry
          ? 'Hide Add Health Check Entry'
          : 'Add HealthCheck Entry'}
      </button>
      {showAddHealthCheckEntry && (
        <AddHealthCheckEntryForm
          patientId={patient.id}
          entryAdded={(entry) => {
            setPatient({ ...patient, entries: patient.entries.concat(entry) });
          }}
          cancel={() => setShowAddHealthCheckEntry(false)}
        />
      )}
      <h4>entries</h4>
      {patient.entries.map((entry) => {
        switch (entry.type) {
          case 'HealthCheck':
            return <HealthCheckEntryElement key={entry.id} entry={entry} />;
          case 'Hospital':
            return <HospitalEntryElement key={entry.id} entry={entry} />;
          case 'OccupationalHealthcare':
            return (
              <OccupationalHealthcareEntryElement
                key={entry.id}
                entry={entry}
              />
            );
          default:
            assertNever(entry);
        }
      })}
    </div>
  ) : (
    <div>Loading...</div>
  );
};
export default PatientPage;
