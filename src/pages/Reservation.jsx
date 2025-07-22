import React, { useState, useEffect } from "react";
import { Form, Input, Button, Row, Col, Checkbox, message, Spin, Typography, Modal } from "antd";
import axios from "axios";
import { useLocation } from "react-router-dom";

const { Text } = Typography;

const TIMES = (() => {
  const times = [];
  for (let h = 9; h <= 19; h++) {
    for (let m = 0; m < 60; m += 30) {
      if (h === 19 && m === 30) {
        continue; // 19:30은 건너뛰기
      }
      const hour = String(h).padStart(2, '0');
      const minute = String(m).padStart(2, '0');
      times.push(`${hour}:${minute}`);
    }
  }
  return times;
})();

export default function Reservation() {
  const [form] = Form.useForm();
  const location = useLocation();
  const [massages, setMassages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userLoading, setUserLoading] = useState(true);
  const [selectedServiceId, setSelectedServiceId] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [emailNotice, setEmailNotice] = useState(false);
  const [initialUserData, setInitialUserData] = useState({ name: "", phoneNumber: "" });
  const [showNameWarning, setShowNameWarning] = useState(false);
  const [showPhoneWarning, setShowPhoneWarning] = useState(false);

  useEffect(() => {
    const fetchMassagesAndUserProfile = async () => {
      try {
        // Fetch massages
        const massageResponse = await axios.get("/massages");
        setMassages(massageResponse.data);

        // Fetch user profile
        const token = localStorage.getItem("token");
        if (token) {
          const userProfileResponse = await axios.get("/user/profile", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const { name, phoneNumber } = userProfileResponse.data;
          form.setFieldsValue({
            name: name,
            phone: phoneNumber,
          });
          setInitialUserData({ name, phoneNumber });
        } else {
          message.warn("로그인 정보가 없습니다. 이름과 연락처를 직접 입력해주세요.");
        }

        // URL 쿼리 파라미터에서 serviceId를 가져와 초기 선택
        const params = new URLSearchParams(location.search);
        const serviceIdFromUrl = params.get("serviceId");
        if (serviceIdFromUrl) {
          const initialService = massageResponse.data.find(svc => svc.id === parseInt(serviceIdFromUrl));
          if (initialService) {
            form.setFieldsValue({ service: initialService.id });
            setSelectedServiceId(initialService.id);
          }
        }

      } catch (error) {
        console.error("Failed to fetch data:", error);
        message.error("정보를 불러오는데 실패했습니다.");
      } finally {
        setLoading(false);
        setUserLoading(false);
      }
    };
    fetchMassagesAndUserProfile();
  }, [form, location.search]);

  const getDates = () => {
    const dates = [];
    const today = new Date();
    const daysOfWeek = ["일", "월", "화", "수", "목", "금", "토"];

    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const dayLabel = daysOfWeek[date.getDay()];
      const dayNum = date.getDate();
      const fullDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${dayNum.toString().padStart(2, '0')}`;
      dates.push({ label: dayLabel, day: dayNum, fullDate: fullDate, disabled: false });
    }
    return dates;
  };

  const DATES = getDates();

  const handleService = (id) => {
    setSelectedServiceId(id);
    form.setFieldsValue({ service: id }); // 폼 필드도 업데이트
    console.log("Service selected:", id);
  };

  const onFinish = async (values) => {
    console.log("onFinish called with values:", values);
    const token = localStorage.getItem("token");
    if (!token) {
      message.error("로그인이 필요합니다.");
      return;
    }

    if (!selectedServiceId || !selectedDate || !selectedTime) {
      message.error("서비스, 날짜, 시간을 모두 선택해주세요.");
      return;
    }

    try {
      const reservationData = {
        serviceId: selectedServiceId,
        reservationDate: selectedDate,
        timeSlot: selectedTime,
        request: values.request || "",
      };

      await axios.post("/reservations", reservationData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("예약 성공, 모달 띄우기 직전");
      setIsModalOpen(true);
    } catch (error) {
      console.error("Reservation error:", error);
      message.error("예약에 실패했습니다. 다시 시도해주세요.");
    }
  };

  if (loading || userLoading) {
    return (
      <div style={{ textAlign: "center", padding: "100px 0" }}>
        <Spin size="large" />
        <p>정보를 불러오는 중...</p>
      </div>
    );
  }

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
              <Input
                placeholder="이름을 입력하세요"
                onChange={(e) => setShowNameWarning(e.target.value !== initialUserData.name)}
              />
            </Form.Item>
            {showNameWarning && (
              <Text type="danger" style={{ fontSize: 12, marginTop: -16, display: "block" }}>
                * 로그인된 사용자와 예약자가 다를 경우 확인해주세요.
              </Text>
            )}
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item label="연락처" name="phone" rules={[{ required: true, message: "연락처를 입력하세요" }]}>
              <Input
                placeholder="010-0000-0000"
                onChange={(e) => setShowPhoneWarning(e.target.value !== initialUserData.phoneNumber)}
              />
            </Form.Item>
            {showPhoneWarning && (
              <Text type="danger" style={{ fontSize: 12, marginTop: -16, display: "block" }}>
                * 로그인된 사용자와 예약자가 다를 경우 확인해주세요.
              </Text>
            )}
          </Col>
        </Row>

        {/* -------- 서비스 선택 버튼 -------- */}
        <Form.Item
          label="서비스 선택"
          name="service"
          rules={[{ required: true, message: "서비스를 선택하세요" }]}
        >
          <div style={{ display: "flex", gap: 16 }}>
            {massages.map((svc) => (
              <Button
                key={svc.id}
                type={selectedServiceId === svc.id ? "primary" : "default"}
                style={{
                  flex: 1,
                  height: 42,
                  fontWeight: 600,
                  fontSize: 15,
                  borderRadius: 20,
                  background: selectedServiceId === svc.id
                    ? "linear-gradient(90deg, #377DFF 0%, #7fcfff 100%)"
                    : "#f4f4f4",
                  color: selectedServiceId === svc.id ? "#fff" : "#222",
                  border: "none",
                  boxShadow: selectedServiceId === svc.id
                    ? "0 2px 12px 0 rgba(55,125,255,0.13)"
                    : "none",
                  transition: "all 0.18s"
                }}
                onClick={() => handleService(svc.id)}
              >
                {svc.name}
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
            {DATES.map(({ label, day, fullDate, disabled }) => (
              <div key={fullDate} style={{ textAlign: "center" }}>
                <div style={{ color: "#888", fontSize: 14, marginBottom: 2, opacity: disabled ? 0.2 : 1 }}>
                  {label}
                </div>
                <Button
                  type={selectedDate === fullDate && !disabled ? "primary" : "default"}
                  disabled={disabled}
                  style={{
                    width: 42,
                    height: 42,
                    padding: 0,
                    borderRadius: "50%",
                    background: selectedDate === fullDate && !disabled
                      ? "linear-gradient(90deg, #377DFF 0%, #7fcfff 100%)"
                      : "#f4f4f4",
                    color: selectedDate === fullDate && !disabled ? "#fff" : "#222",
                    fontWeight: 600,
                    fontSize: 18,
                    boxShadow: selectedDate === fullDate && !disabled
                      ? "0 2px 10px 0 rgba(55,125,255,0.15)"
                      : "none",
                    border: "none",
                    opacity: disabled ? 0.25 : 1,
                    transition: "all 0.18s"
                  }}
                  onClick={() => {
                    if (!disabled) {
                      setSelectedDate(fullDate);
                      form.setFieldsValue({ date: fullDate });
                      console.log("날짜 선택: ", fullDate);
                    }
                  }}
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
                type={selectedTime === time ? "primary" : "default"}
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
                onClick={() => {
                  setSelectedTime(time);
                  form.setFieldsValue({ time: time });
                  console.log("시간 선택: ", time);
                }}
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

        <Modal
          title="예약 완료"
          open={isModalOpen}
          onOk={() => {
            setIsModalOpen(false);
            form.resetFields();
            setSelectedServiceId(null);
            setSelectedDate(null);
            setSelectedTime(null);
            setEmailNotice(false);
          }}
          onCancel={() => setIsModalOpen(false)}
          footer={[
            <Button key="ok" type="primary" onClick={() => {
              setIsModalOpen(false);
              form.resetFields();
              setSelectedServiceId(null);
              setSelectedDate(null);
              setSelectedTime(null);
              setEmailNotice(false);
            }}>
              확인
            </Button>,
          ]}
        >
          <p>{`${selectedDate} ${selectedTime} 에 예약이 신청되었습니다. ✅`}</p>
        </Modal>

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