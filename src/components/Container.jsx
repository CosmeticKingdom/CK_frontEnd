// 컨테이너를 따로 분리하면 모든 페이지에서 import해서 쓰기 편함
import React from "react";
export default function Container({ children }) {
  return (
    <div
      style={{
        width: "100%",
        margin: "0 auto",
        padding: "120px 24px 80px 24px" // 상단 및 하단 패딩 증가
      }}
    >
      {children}
    </div>
  );
}