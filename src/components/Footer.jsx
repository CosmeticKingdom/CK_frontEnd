import React from "react";

export default function Footer() {
  return (
    <footer style={{
      background: "#fafafa",
      padding: "32px 0",
      borderTop: "1px solid #eee",
      marginTop: 40
    }}>
      <div style={{
        width: 1200,
        margin: "0 auto",
        display: "flex",
        justifyContent: "space-between",
        fontSize: 14,
        color: "#666"
      }}>
        <div>
          <div><b>회사</b></div>
          <div>소개</div>
          <div>전문가 팀</div>
          <div>고객 센터</div>
        </div>
        <div>
          <div><b>고객 지원</b></div>
          <div>예약 안내</div>
          <div>이용 약관</div>
          <div>개인정보 처리방침</div>
        </div>
        <div>© 2025 화장품나라 & dhSon. All rights reserved.</div>
      </div>
    </footer>
  );
}