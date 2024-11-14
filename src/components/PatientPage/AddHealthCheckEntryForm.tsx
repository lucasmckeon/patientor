import { useState } from 'react';
import { addEntry } from '../../services/patients';
import { Entry, HealthCheckRating } from '../../types';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Select from 'react-select';
const AddHealthCheckEntryForm = ({
  patientId,
  entryAdded,
  cancel,
}: {
  patientId: string;
  entryAdded: (entry: Entry) => void;
  cancel: () => void;
}) => {
  const [description, setDescription] = useState('');
  const [date, setDate] = useState<Date | null>(null);
  const [specialist, setSpecialist] = useState('');
  const [healthCheckRating, setHealthCheckRating] =
    useState<HealthCheckRating>();
  const [diagnosisCodes, setDiagnosisCodes] = useState<string[]>([]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!description || !date || !specialist || !healthCheckRating) {
      alert('Fill in required fields');
      return;
    }
    try {
      const entry = await addEntry(patientId, {
        type: 'HealthCheck',
        description,
        date: date.toLocaleDateString(),
        specialist,
        healthCheckRating,
        diagnosisCodes,
      });
      entryAdded(entry);
    } catch (error) {
      console.log('Error submitting entry');
    }
  };

  const healthCheckRatingOptions = [
    { value: HealthCheckRating.Healthy, label: HealthCheckRating.Healthy },
    { value: HealthCheckRating.LowRisk, label: HealthCheckRating.LowRisk },
    { value: HealthCheckRating.HighRisk, label: HealthCheckRating.HighRisk },
    {
      value: HealthCheckRating.CriticalRisk,
      label: HealthCheckRating.CriticalRisk,
    },
  ];
  const diagnosisCodesOptions = [
    { value: 'M24.2', label: 'Disorder of ligament' },
    {
      value: 'M51.2',
      label: 'Other specified intervertebral disc displacement',
    },
    {
      value: 'S03.5',
      label:
        'Sprain and strain of joints and ligaments of other and unspecified parts of head',
    },
    {
      value: 'J10.1',
      label:
        'Influenza with other respiratory manifestations, other influenza virus identified',
    },
    { value: 'J06.9', label: 'Acute upper respiratory infection, unspecified' },
    { value: 'Z57.1', label: 'Occupational exposure to radiation' },
    { value: 'N30.0', label: 'Acute cystitis' },
    { value: 'H54.7', label: 'Unspecified visual loss' },
    { value: 'J03.0', label: 'Streptococcal tonsillitis' },
    { value: 'L60.1', label: 'Onycholysis' },
    { value: 'Z74.3', label: 'Need for continuous supervision' },
    { value: 'L20', label: 'Atopic dermatitis' },
    { value: 'F43.2', label: 'Adjustment disorders' },
    { value: 'S62.5', label: 'Fracture of thumb' },
    { value: 'H35.29', label: 'Other proliferative retinopathy' },
  ];
  return (
    <form onSubmit={handleSubmit}>
      <label>
        Description*:
        <input
          type="text"
          name="description"
          value={description}
          onChange={(e) => setDescription(e.currentTarget.value)}
        />
      </label>
      <label>
        Date*:
        <DatePicker selected={date} onChange={(d) => setDate(d)} />
      </label>
      <label>
        Specialist*:
        <input
          type="text"
          name="specialist"
          value={specialist}
          onChange={(e) => setSpecialist(e.currentTarget.value)}
        />
      </label>

      <label>
        Healthcheck rating*:
        <Select
          options={healthCheckRatingOptions}
          onChange={(val) => setHealthCheckRating(val?.value)}
        />
      </label>

      <label>
        Diagnosis codes:
        <Select
          options={diagnosisCodesOptions}
          isMulti
          onChange={(values) =>
            setDiagnosisCodes(values.map((option) => option.value))
          }
        />
      </label>

      <button type="button" onClick={() => cancel()}>
        cancel
      </button>
      <button type="submit">add</button>
    </form>
  );
};

export { AddHealthCheckEntryForm };
