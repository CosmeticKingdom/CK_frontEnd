import React, { useState } from "react";
import { Form, Input, Button, Row, Col, Checkbox, message } from "antd";

const SERVICES = [
  { value: "basic", label: "기본 피부 관리" },
  { value: "lifting", label: "고급 트리트먼트" },
  { value: "acne", label: "맞춤형 관리" }
];

const DATES = [
  { label: "화", day: 22 },
  { label: "수", day: 23 },
  { label: "목", day: 24 },
  { label: "금", day: 25 },
  { label: "토", day: 26 },
  { label: "일", day: 27, disabled: true },
  { label: "월", day: 28 },
];

const TIMES = [
  "10:00", "10:30", "11:00",
  "11:30", "12:00", "12:30",
  "13:00", "13:30", "14:00",
  "14:30", "15:00", "15:30",
  "16:00", "16:30", "17:00",
  "17:30", "18:00", "18:30",
];

export default function Reservation() {
  const [form] = Form.useForm();
  const [selectedService, setSelectedService] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [emailNotice, setEmailNotice] = useState(false);

  // 선택 값 Form에 세팅
  const handleService = (val) => {
    setSelectedService(val);
    form.setFieldsValue({ service: val });
  };
  const handleDate = (val) => {
    setSelectedDate(val);
    form.setFieldsValue({ date: val });
  };
  const handleTime = (val) => {
    setSelectedTime(val);
    form.setFieldsValue({ time: val });
  };

  // 제출 예시
  const onFinish = (values) => {
    values.emailNotice = emailNotice;
    message.success("예약 신청 완료! (콘솔 확인)");
    console.log(values);
  };

  return (
    <div
      style={{
        maxWidth: 700,
        margin: "100px auto",
        background: "#fff",
        borderRadius: 12,
        boxShadow: "0 2px 10px 0 rgba(0,0,0,0.06)",
        padding: 32,
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: 24 }}>온라인 피부관리 서비스 예약</h2>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
          name: "",
          phone: "",
          request: ""
        }}
      >
        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item label="이름" name="name" rules={[{ required: true, message: "이름을 입력하세요" }]}>
              <Input placeholder="이름을 입력하세요" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item label="연락처" name="phone" rules={[{ required: true, message: "연락처를 입력하세요" }]}>
              <Input placeholder="010-0000-0000" />
            </Form.Item>
          </Col>
        </Row>

        {/* -------- 서비스 선택 버튼 -------- */}
        <Form.Item
          label="서비스 선택"
          name="service"
          rules={[{ required: true, message: "서비스를 선택하세요" }]}
        >
          <div style={{ display: "flex", gap: 16 }}>
            {SERVICES.map((svc) => (
              <Button
                key={svc.value}
                type={selectedService === svc.value ? "primary" : "default"}
                style={{
                  flex: 1,
                  height: 42,
                  fontWeight: 600,
                  fontSize: 15,
                  borderRadius: 20,
                  background: selectedService === svc.value
                    ? "linear-gradient(90deg, #377DFF 0%, #7fcfff 100%)"
                    : "#f4f4f4",
                  color: selectedService === svc.value ? "#fff" : "#222",
                  border: "none",
                  boxShadow: selectedService === svc.value
                    ? "0 2px 12px 0 rgba(55,125,255,0.13)"
                    : "none",
                  transition: "all 0.18s"
                }}
                onClick={() => handleService(svc.value)}
              >
                {svc.label}
              </Button>
            ))}
          </div>
        </Form.Item>

        {/* -------- 날짜 선택 버튼 -------- */}
        <Form.Item
          label="희망 날짜"
          name="date"
          rules={[{ required: true, message: "날짜를 선택하세요" }]}
        >
          <div style={{ display: "flex", gap: 16 }}>
            {DATES.map(({ label, day, disabled }) => (
              <div key={day} style={{ textAlign: "center" }}>
                <div style={{ color: "#888", fontSize: 14, marginBottom: 2, opacity: disabled ? 0.2 : 1 }}>
                  {label}
                </div>
                <Button
                  type="text"
                  disabled={disabled}
                  style={{
                    width: 42,
                    height: 42,
                    padding: 0,
                    borderRadius: "50%",
                    background: selectedDate === day && !disabled
                      ? "linear-gradient(90deg, #377DFF 0%, #7fcfff 100%)"
                      : "#f4f4f4",
                    color: selectedDate === day && !disabled ? "#fff" : "#222",
                    fontWeight: 600,
                    fontSize: 18,
                    boxShadow: selectedDate === day && !disabled
                      ? "0 2px 10px 0 rgba(55,125,255,0.15)"
                      : "none",
                    border: "none",
                    opacity: disabled ? 0.25 : 1,
                    transition: "all 0.18s"
                  }}
                  onClick={() => !disabled && handleDate(day)}
                >
                  {day}
                </Button>
              </div>
            ))}
          </div>
        </Form.Item>

        {/* -------- 시간 선택 버튼 -------- */}
        <Form.Item
          label="희망 시간"
          name="time"
          rules={[{ required: true, message: "시간을 선택하세요" }]}
        >
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 12
          }}>
            {TIMES.map((time) => (
              <Button
                key={time}
                type="text"
                style={{
                  borderRadius: 20,
                  height: 42,
                  fontSize: 15,
                  background: selectedTime === time
                    ? "linear-gradient(90deg, #377DFF 0%, #7fcfff 100%)"
                    : "#f4f4f4",
                  color: selectedTime === time ? "#fff" : "#222",
                  boxShadow: selectedTime === time
                    ? "0 2px 10px 0 rgba(55,125,255,0.12)"
                    : "none",
                  fontWeight: 600,
                  border: "none",
                  transition: "all 0.15s"
                }}
                onClick={() => handleTime(time)}
              >
                {time}
              </Button>
            ))}
          </div>
        </Form.Item>

        {/* 이메일 안내 수신 체크 */}
        <Form.Item style={{ marginTop: 8 }}>
          <Checkbox
            checked={emailNotice}
            onChange={e => setEmailNotice(e.target.checked)}
            style={{ fontWeight: 500, fontSize: 15 }}
          >
            이메일로 예약 안내 받기
          </Checkbox>
        </Form.Item>

        <Form.Item label="요청사항" name="request">
          <Input.TextArea rows={4} placeholder="추가 요청사항이 있으시면 작성해주세요" />
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            style={{
              width: "100%",
              background: "linear-gradient(90deg, #377DFF 0%, #7fcfff 100%)",
              border: "none",
              fontWeight: 600,
              fontSize: 17,
              letterSpacing: 1,
            }}
          >
            예약 신청하기
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}