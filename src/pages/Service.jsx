import React from "react";
import { Card, Button, Row, Col } from "antd";
import { Link } from "react-router-dom";
import Container from "../components/Container";

const services = [
  {
    id: 1,
    title: "기본 페이셜",
    desc: "깊은 클렌징과 수분 공급으로 맑고 건강한 피부를 만들어드립니다.",
    image: "Facial Treatment",
    price: 90000,
    path: "/reservation?service=기본 피부 관리",
  },
  {
    id: 2,
    title: "리프팅 케어",
    desc: "첨단 기술로 탄력과 firmness를 높이는 전문 리프팅 트리트먼트",
    image: "Skin Lifting",
    price: 150000,
    path: "/reservation?service=고급 트리트먼트",
  },
  {
    id: 3,
    title: "여드름 케어",
    desc: "전문적인 여드름 관리로 맑고 깨끗한 피부를 선사합니다.",
    image: "Acne Care",
    price: 120000,
    path: "/reservation?service=맞춤형 관리",
  },
];

export default function Service() {
  return (
    <Container>
      <h1 style={{ textAlign: "center" }}>피부관리 서비스</h1>
      <p style={{ textAlign: "center", color: "#888" }}>
        전문적이고 맞춤형 피부 트리트먼트로 당신의 아름다움을 완성합니다.
      </p>
      <Row gutter={[24, 24]} justify="center" style={{ marginTop: 40 }}>
        {services.map((svc) => (
          <Col xs={24} sm={24} md={12} lg={8} xl={8} key={svc.id}>
            <Card
              hoverable
              style={{ minHeight: 340, textAlign: "center" }}
              cover={
                <div
                  style={{
                    height: 120,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "#eaecef",
                    fontSize: 28,
                    fontWeight: 600,
                    color: "#7f8c8d"
                  }}
                >
                  {svc.image}
                </div>
              }
            >
              <h3 style={{ margin: "12px 0" }}>{svc.title}</h3>
              <p style={{ minHeight: 48 }}>{svc.desc}</p>
              <div style={{ fontWeight: "bold", fontSize: 18, margin: "20px 0 8px" }}>
                {svc.price.toLocaleString()}원
              </div>
              <Link to={svc.path}>
                <Button type="primary">예약하기</Button>
              </Link>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}