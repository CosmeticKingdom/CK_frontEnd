import React from "react";
import Container from "../components/Container";

export default function MyReservations() {
  return (
    <Container>
      <h2 style={{ textAlign: "center", marginBottom: 40 }}>나의 예약</h2>
      <p style={{ textAlign: "center" }}>예약 내역이 여기에 표시됩니다.</p>
    </Container>
  );
}