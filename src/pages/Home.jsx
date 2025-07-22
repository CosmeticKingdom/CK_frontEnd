import React, { useState, useEffect } from "react";
import { Button, Card, Row, Col, Rate, Spin } from "antd";
import { Link } from "react-router-dom";
import Container from "../components/Container";
import faceSkin from "../assets/img/face_skin.png";
import faceMassage from "../assets/img/face_massage.png";
import fullMassage from "../assets/img/full_massage.png";
import footMassage from "../assets/img/foot_massage.png";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";

const REVIEWS = [
  {
    id: 1,
    name: "민지",
    service: "기본 피부 관리",
    rating: 5,
    comment: "예약부터 관리까지 너무 친절하고 피부가 한층 밝아졌어요. 재방문 의사 100%!",
  },
  {
    id: 2,
    name: "준호",
    service: "고급 트리트먼트",
    rating: 4,
    comment: "시설이 쾌적하고 트리트먼트 효과도 좋아서 만족합니다. 추천합니다.",
  },
  {
    id: 3,
    name: "슬기",
    service: "맞춤형 관리",
    rating: 5,
    comment: "내 피부 타입에 맞게 관리해주셔서 감동이에요. 후기 남깁니다!",
  },
];

const serviceImages = [
  faceMassage,
  fullMassage,
  footMassage,
];

export default function Home() {
  const { showLoginModal } = useAuth();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const isLoggedIn = !!localStorage.getItem("token");

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get("/massages");
        setServices(response.data);
      } catch (error) {
        console.error("Failed to fetch services:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  const handleReservationClick = (e) => {
    if (!isLoggedIn) {
      e.preventDefault();
      showLoginModal();
    }
  };

  return (
    <>
      <Container>
        <div style={{ padding: "64px 0" }}>
          <Row gutter={[24, 24]} align="middle">
            <Col xs={24} md={12} style={{ textAlign: "center" }}>
              <h1>당신의 완벽한 피부를 위한 맞춤 관리</h1>
              <div style={{ color: "#888", marginBottom: 24 }}>
                전문 피부 관리사와 함께 나만의 특별한 피부 관리 여정을 시작하세요.
              </div>
              <Link to="/reservation" onClick={handleReservationClick}>
                <Button type="primary" size="large" style={{ marginRight: 8 }}>
                  예약하기
                </Button>
              </Link>
              <Link to="/service">
                <Button size="large">서비스 알아보기</Button>
              </Link>
            </Col>
            <Col xs={24} md={12} style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <img
                src={faceSkin}
                alt="Skin Care"
                style={{ width: "70%", borderRadius: 8 }}
              />
            </Col>
          </Row>
        </div>
      </Container>

      {/* ====== 여기서부터 배경 전체 확장 ====== */}
      <div
        style={{
          background: "#f8f8f8",
          padding: "64px 0",
          width: "100vw",
          position: "relative",
          left: "50%",
          right: "50%",
          marginLeft: "-50vw",
          marginRight: "-50vw",
        }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ margin: "0 0 32px", textAlign: "center" }}>
            <h2>우리의 피부 관리 서비스</h2>
          </div>

          {loading ? (
            <div style={{ textAlign: "center", padding: "50px 0" }}>
              <Spin size="large" />
              <p>서비스 정보를 불러오는 중...</p>
            </div>
          ) : (
            <Row gutter={[24, 24]} justify="center">
              {services.slice(0, 3).map((svc, index) => (
                <Col xs={24} sm={24} md={8} lg={8} xl={8} key={svc.id}>
                  <Card hoverable bordered={false}>
                    <div style={{ textAlign: "center", marginBottom: 12 }}>
                      <img
                        src={serviceImages[index % serviceImages.length]} // 이미지 순환
                        alt={svc.name}
                        style={{ width: "100%", height: "auto", borderRadius: 8 }}
                      />
                    </div>
                    <h3>{svc.name}</h3>
                    <p>{svc.description}</p>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </div>
      </div>
      {/* ====== 배경 확장 끝 ====== */}

      <Container>
        <div style={{ margin: "64px 0 32px", textAlign: "center" }}>
          <h2>고객 후기</h2>
          <p style={{ color: "#888" }}>실제 고객님들의 소중한 후기입니다.</p>
        </div>

        <Row gutter={[24, 24]} justify="center">
          {REVIEWS.map(review => (
            <Col xs={24} sm={24} md={8} lg={8} xl={8} key={review.id}>
              <Card
                hoverable
                style={{
                  minHeight: 220,
                  marginBottom: 0,
                  background: "#fafcff",
                  borderRadius: 14
                }}
              >
                <div style={{ fontWeight: "bold", fontSize: 17, marginBottom: 2 }}>
                  {review.name} <span style={{ color: "#bbb", fontWeight: 400, fontSize: 14 }}>({review.service})</span>
                </div>
                <Rate disabled value={review.rating} style={{ fontSize: 18, margin: "6px 0 10px 0" }} />
                <div style={{ fontSize: 15 }}>{review.comment}</div>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </>
  );
}