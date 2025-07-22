import React, { useState, useEffect } from "react";
import { Tabs, List, message, Spin } from "antd";
import axios from "axios";
import Container from "../components/Container";

export default function MyReservations() {
  const [loading, setLoading] = useState(true);
  const [pendingReservations, setPendingReservations] = useState([]);
  const [confirmedReservations, setConfirmedReservations] = useState([]);
  const [massagesMap, setMassagesMap] = useState({});

  useEffect(() => {
    const fetchMyReservationsAndMassages = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          message.error("로그인이 필요합니다.");
          setLoading(false);
          return;
        }

        // Fetch massages
        const massageResponse = await axios.get("/massages");
        const newMassagesMap = {};
        massageResponse.data.forEach(massage => {
          newMassagesMap[massage.id] = massage.name;
        });
        setMassagesMap(newMassagesMap);

        // Fetch reservations
        const response = await axios.get("/reservations/my", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const reservations = response.data;
        setPendingReservations(reservations.filter(res => res.status === "PENDING"));
        setConfirmedReservations(reservations.filter(res => res.status === "CONFIRMED"));

      } catch (error) {
        console.error("Failed to fetch data:", error);
        message.error("정보를 불러오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchMyReservationsAndMassages();
  }, []);

  if (loading) {
    return (
      <Container>
        <div style={{ textAlign: "center", padding: "100px 0" }}>
          <Spin size="large" />
          <p>예약 내역을 불러오는 중...</p>
        </div>
      </Container>
    );
  }

  const items = [
    {
      key: "1",
      label: "신청 대기중",
      children: (
        <div style={{ maxHeight: "490px", overflowY: "auto" }}>
          <List
            itemLayout="horizontal"
            dataSource={pendingReservations}
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta
                  title={massagesMap[item.serviceId] || `서비스 ID: ${item.serviceId}`}
                  description={`예약 시간: ${new Date(item.reservationTime).toLocaleString()} / 요청: ${item.request || "없음"}`}
                />
              </List.Item>
            )}
          />
        </div>
      ),
    },
    {
      key: "2",
      label: "승낙된 예약",
      children: (
        <div style={{ maxHeight: "490px", overflowY: "auto" }}>
          <List
            itemLayout="horizontal"
            dataSource={confirmedReservations}
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta
                  title={massagesMap[item.serviceId] || `서비스 ID: ${item.serviceId}`}
                  description={`예약 시간: ${new Date(item.reservationTime).toLocaleString()} / 요청: ${item.request || "없음"}`}
                />
              </List.Item>
            )}
          />
        </div>
      ),
    },
  ];

  return (
    <Container>
      <h2 style={{ textAlign: "center", marginBottom: 40 }}>나의 예약</h2>
      <div style={{ maxWidth: "800px", margin: "0 auto", minHeight: "550px" }}>
        <Tabs defaultActiveKey="1" items={items} centered />
      </div>
    </Container>
  );
}
