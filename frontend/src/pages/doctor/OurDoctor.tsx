import React, { useEffect, useState } from "react";
import { getDoctors } from "../../service/http/doctor";
import type { DoctorInterface } from "../../interface/IDoctor";

import doctorImg from "../../assets/doctorg.png"; // หมอหญิง
import doctorm from "../../assets/doctorm.png"; // หมอชาย

import styles from "./OurDoctor.module.css";

const OurDoctor: React.FC = () => {
  const [doctors, setDoctors] = useState<DoctorInterface[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getDoctors()
      .then(setDoctors)
      .catch((err) => {
        setError("Failed to load doctors");
        console.error(err);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className={styles["ourdoctor-loading"]}>Loading doctors...</p>;
  if (error) return <p className={styles["ourdoctor-error"]}>{error}</p>;

  const getDoctorImage = (genderId?: number) => {
    if (genderId === 1) return doctorm;
    if (genderId === 2) return doctorImg;
    return doctorImg;
  };

  return (
    <div className={styles["ourdoctor-container"]}>
      {doctors.map((doctor, idx) => (
        <div
          key={doctor.id}
          className={`${styles["ourdoctor-card"]} ${
            idx % 2 === 0 ? styles["ourdoctor-card-even"] : styles["ourdoctor-card-odd"]
          }`}
        >
          <img
            src={getDoctorImage(doctor.gender_id)}
            alt="Doctor"
            className={styles["ourdoctor-image"]}
          />
          <div className={styles["ourdoctor-name"]}>
            {doctor.first_name} {doctor.last_name}
          </div>
        </div>
      ))}
    </div>
  );
};

export default OurDoctor;
