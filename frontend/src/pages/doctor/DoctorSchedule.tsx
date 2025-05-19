import React, { useState } from 'react';
import { DatePicker, TimePicker } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { createDoctorSchedule } from '../../service/http/doctor'; // เรียกใช้ฟังก์ชันนี้
import styles from './DoctorSchedule.module.css';
import { useNavigate } from "react-router-dom";

const DoctorSchedule: React.FC = () => {
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [startTime, setStartTime] = useState<Dayjs | null>(null);
  const [endTime, setEndTime] = useState<Dayjs | null>(null);
  const navigate = useNavigate();


  const onDateChange = (dates: Dayjs[], dateStrings: string[]) => {
    setSelectedDates(dateStrings);
    console.log('Selected dates:', dateStrings);
  };

  const onStartTimeChange = (time: Dayjs | null) => {
    setStartTime(time);
    console.log('Start Time:', time?.format('HH:mm'));
  };

  const onEndTimeChange = (time: Dayjs | null) => {
    setEndTime(time);
    console.log('End Time:', time?.format('HH:mm'));
  };

  const handleSubmit = async () => {
    try {
      // ตรวจสอบว่ามีข้อมูลครบหรือไม่
      if (!startTime || !endTime) {
        alert("Please select both start and end time.");
        return;
      }

      // แปลงเวลาเป็น string format "HH:mm"
      const start_time = startTime.format("HH:mm");
      const end_time = endTime.format("HH:mm");

      // สมมุติให้ doctorId เป็น 1 (สามารถดึงจาก session หรือ API ตามต้องการ)
      const doctorId = 1;

      // เรียกฟังก์ชันสร้างตารางการทำงานของหมอ
      const result = await createDoctorSchedule(doctorId, selectedDates, start_time, end_time);
      console.log("Schedule created successfully:", result);
      alert("Schedule saved successfully");''
      navigate("/doctor");
    } catch (error) {
      console.error("Failed to create schedule:", error);
      alert("Failed to save schedule");
    }
  };

  return (
    <div className={styles['docsch-container']}>
      <div className={styles['docsch-card']}>
        <h2 className={styles['docsch-title']}>🩺 Doctor's work schedule</h2>

        {/* DatePicker */}
        <div className={styles['docsch-picker']}>
          <DatePicker
            multiple
            onChange={onDateChange}
            defaultValue={[dayjs('2025-06-01'), dayjs('2025-06-03')]}
            size="middle"
            className={styles['docsch-date-picker']}
          />
        </div>

        {/* TimePicker */}
        <div className={styles['docsch-picker']}>
          <h3>⏰ Set Time</h3>
          <div className={styles['docsch-time-picker']}>
            <TimePicker
              value={startTime}
              onChange={onStartTimeChange}
              format="HH:mm"
              placeholder="Start Time"
              className={styles['docsch-time']}
            />
            <TimePicker
              value={endTime}
              onChange={onEndTimeChange}
              format="HH:mm"
              placeholder="End Time"
              className={styles['docsch-time']}
            />
          </div>
        </div>

        {/* ปุ่มบันทึก */}
        <button className={styles['docsch-btn']} onClick={handleSubmit}>Save Schedule</button>
      </div>
    </div>
  );
};

export default DoctorSchedule;
