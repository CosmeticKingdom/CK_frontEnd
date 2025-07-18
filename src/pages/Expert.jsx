import React from "react";
import { Card, Row, Col, Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";
import Container from "../components/Container";

const EXPERTS = [
  {
    id: 1,
    name: "김미정",
    title: "수석 피부관리 전문가",
    desc: "15년 경력의 피부 재생 및 안티에이징 진료",
  },
  {
    id: 2,
    name: "이서연",
    title: "여드름 및 트러블 케어 전문가",
    desc: "피부 트러블 솔루션 및 맞춤 관리 전문",
  },
  {
    id: 3,
    name: "박지현",
    title: "수분 및 영양 케어 전문가",
    desc: "깊이 있는 보습과 영양 공급 케어",
  },
];

export default function Expert() {
  return (
    <Container>
      <h2 style={{ textAlign: "center", marginBottom: 18 }}>우리의 전문가 팀</h2>
      <p style={{ textAlign: "center", color: "#888", marginBottom: 40 }}>
        최고의 피부 관리 전문가들이 여러분의 아름다움을 책임집니다.
      </p>
      <Row gutter={[24, 24]} justify="center">
        {EXPERTS.map(expert => (
          <Col xs={24} sm={24} md={8} lg={8} xl={8} key={expert.id}>
            <Card
              hoverable
              style={{ minHeight: 250, textAlign: "center" }}
            >
              <Avatar
                size={80}
                icon={<UserOutlined />}
                style={{
                  background: "#eaecef",
                  color: "#2574ff",
                  fontSize: 32,
                  marginBottom: 16,
                }}
              />
              <div style={{ fontWeight: "bold", fontSize: 20, marginBottom: 4 }}>
                {expert.name}
              </div>
              <div style={{ color: "#888", marginBottom: 10 }}>
                {expert.title}
              </div>
              <div style={{ fontSize: 15 }}>{expert.desc}</div>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}