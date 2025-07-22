import React, { useState, useEffect } from "react";
import { Card, Button, Row, Col, Spin } from "antd";
import { Link } from "react-router-dom";
import Container from "../components/Container";
import axios from "axios";
import faceMassage from "../assets/img/face_massage.png";
import fullMassage from "../assets/img/full_massage.png";
import footMassage from "../assets/img/foot_massage.png";

const serviceImages = [
  faceMassage,
  fullMassage,
  footMassage,
];

export default function Service() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get("/massages");
        setServices(response.data);
      } catch (error) {
        console.error("Failed to fetch services:", error);
        // 에러 처리 (예: 사용자에게 메시지 표시)
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  if (loading) {
    return (
      <Container>
        <div style={{ textAlign: "center", padding: "50px 0" }}>
          <Spin size="large" />
          <p>서비스 정보를 불러오는 중...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <h1 style={{ textAlign: "center" }}>피부관리 서비스</h1>
      <p style={{ textAlign: "center", color: "#888" }}>
        전문적이고 맞춤형 피부 트리트먼트로 당신의 아름다움을 완성합니다.
      </p>
      <Row gutter={[24, 24]} justify="center" style={{ marginTop: 40 }}>
        {services.map((svc, index) => (
          <Col xs={24} sm={24} md={12} lg={8} xl={8} key={svc.id}>
            <Card
              hoverable
              style={{ minHeight: 340, textAlign: "center" }}
              cover={
                <div style={{ height: 200, overflow: "hidden", borderRadius: 8 }}>
                  <img
                    alt={svc.name}
                    src={serviceImages[index % serviceImages.length]}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </div>
              }
            >
              <h3 style={{ margin: "12px 0" }}>{svc.name}</h3>
              <p style={{ minHeight: 48 }}>{svc.description}</p>
              <div style={{ fontWeight: "bold", fontSize: 18, margin: "20px 0 8px" }}>
                {svc.price.toLocaleString()}원
                {svc.durationMinutes && (
                  <span style={{ color: "#888", fontSize: 14, marginLeft: 8 }}>
                    ({svc.durationMinutes}분)
                  </span>
                )}
              </div>
              <Link to={`/reservation?serviceId=${svc.id}&serviceName=${svc.name}`}> {/* 예약 링크 수정 */}
                <Button type="primary">예약하기</Button>
              </Link>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}