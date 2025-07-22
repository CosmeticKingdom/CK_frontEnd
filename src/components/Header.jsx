import React, { useState, useEffect } from "react";
import { Menu, Modal, Form, Input, Button, Dropdown, Typography, message } from "antd";
import { Link, useLocation } from "react-router-dom";
import { UserOutlined } from "@ant-design/icons";
import axios from "axios";
import ckLogo from "../assets/img/ck_logo.png";
import { useAuth } from "../contexts/AuthContext";

const { Text } = Typography;

axios.defaults.baseURL = "http://localhost:8080";

const items = [
  { label: <Link to="/">홈</Link>, key: "/" },
  { label: <Link to="/service">서비스</Link>, key: "/service" },
  { label: <Link to="/reservation">예약</Link>, key: "/reservation" },
  { label: <Link to="/expert">전문가</Link>, key: "/expert" },
  { label: <Link to="/inquiry">문의</Link>, key: "/inquiry" }
];

export default function Header() {
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { isLoginModalOpen, showLoginModal, closeLoginModal } = useAuth();
  const [modalMode, setModalMode] = useState("login");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const showModal = (mode) => {
    setModalMode(mode);
    showLoginModal();
  };

  const handleCancel = () => closeLoginModal();

  const onLoginFinish = async (values) => {
    try {
      const response = await axios.post("/auth/login", {
        loginId: values.username,
        password: values.password,
      });
      if (response.data && response.data.accessToken) {
        localStorage.setItem("token", response.data.accessToken);
        setIsLoggedIn(true);
        closeLoginModal();
        message.success("로그인되었습니다.");
      } else {
        message.error("로그인에 실패했습니다. 응답 형식을 확인해주세요.");
      }
    } catch (error) {
      console.error("Login error:", error);
      message.error("아이디 또는 비밀번호가 일치하지 않습니다.");
    }
  };

  const onSignupFinish = async (values) => {
    try {
      await axios.post("/auth/signup", {
        loginId: values.username,
        password: values.password,
        email: values.email,
        name: values.name,
        phoneNumber: values.phoneNumber,
        role: "USER", // 기본 역할을 'USER'로 설정
      });
      message.success("회원가입이 완료되었습니다. 로그인해주세요.");
      setModalMode("login");
    } catch (error) {
      console.error("Signup error:", error);
      message.error("회원가입에 실패했습니다. 입력 정보를 확인해주세요.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    message.success("로그아웃되었습니다.");
  };

  const userMenuItems = (
    <Menu>
      <Menu.Item key="profile">
        <Link to="/profile">내 정보</Link>
      </Menu.Item>
      <Menu.Item key="my-reservations">
        <Link to="/my-reservations">나의 예약</Link>
      </Menu.Item>
      <Menu.Item key="logout" onClick={handleLogout}>
        로그아웃
      </Menu.Item>
    </Menu>
  );

  // 공통 폼 스타일
  const FORM_WIDTH = 370;
  const FORM_LABEL_COL = { span: 7 };
  const FORM_WRAPPER_COL = { span: 17 };
  const labelCenterStyle = { display: "block", textAlign: "center", width: "100%" };

  return (
    <header
      style={{
        background: scrolled ? "rgba(255, 255, 255, 0.8)" : "#fff",
        borderBottom: "1px solid #eee",
        backdropFilter: scrolled ? "blur(5px)" : "none",
        transition: "background 0.3s, backdrop-filter 0.3s",
        position: "fixed",
        top: 0,
        width: "100%",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          width: 1200,
          margin: "0 auto",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          height: 64
        }}
      >
        <Link to="/">
          <img src={ckLogo} alt="로고" style={{ height: 80 }} />
        </Link>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Menu
            mode="horizontal"
            selectedKeys={[location.pathname]}
            items={items}
            style={{ borderBottom: "none", minWidth: 1, fontWeight: 500, fontSize: 16, background: "transparent" }}
            overflowedIndicator={null}
          />
          <div style={{ marginLeft: 5 }}>
            {isLoggedIn ? (
              <Dropdown overlay={userMenuItems} placement="bottomRight" arrow>
                <UserOutlined style={{ fontSize: 24, cursor: "pointer" }} />
              </Dropdown>
            ) : (
              <Button type="text" onClick={() => showModal("login")} style={{ fontSize: 16, fontWeight: 500 }}>
                로그인
              </Button>
            )}
          </div>
        </div>
      </div>

      <Modal
        title={modalMode === "login" ? "로그인" : "회원가입"}
        open={isLoginModalOpen}
        onCancel={handleCancel}
        footer={null}
        width={FORM_WIDTH + 30}
      >
        {modalMode === "login" ? (
          <Form
            name="login"
            onFinish={onLoginFinish}
            autoComplete="off"
            style={{ maxWidth: FORM_WIDTH, margin: "0 auto" }}
            labelCol={FORM_LABEL_COL}
            wrapperCol={FORM_WRAPPER_COL}
          >
            <Form.Item
              label={<span style={labelCenterStyle}>아이디</span>}
              name="username"
              rules={[{ required: true, message: "아이디를 입력해주세요!" }]}
              style={{ marginBottom: 18 }}
            >
              <Input size="large" style={{ width: "100%" }} />
            </Form.Item>

            <Form.Item
              label={<span style={labelCenterStyle}>비밀번호</span>}
              name="password"
              rules={[{ required: true, message: "비밀번호를 입력해주세요!" }]}
              style={{ marginBottom: 18 }}
            >
              <Input.Password size="large" style={{ width: "100%" }} />
            </Form.Item>

            <Form.Item wrapperCol={{ span: 24 }}>
              <Button type="primary" htmlType="submit" size="large" style={{ width: "100%" }}>
                로그인
              </Button>
            </Form.Item>
            <Text type="secondary" style={{ display: "block", textAlign: "center", marginTop: 10 }}>
              계정이 없으신가요?{" "}
              <Button type="link" onClick={() => setModalMode("signup")} style={{ padding: 0, height: "auto" }}>
                회원가입
              </Button>
            </Text>
          </Form>
        ) : (
          <Form
            name="signup"
            onFinish={onSignupFinish}
            autoComplete="off"
            style={{ maxWidth: FORM_WIDTH, margin: "0 auto" }}
            labelCol={FORM_LABEL_COL}
            wrapperCol={FORM_WRAPPER_COL}
          >
            <Form.Item
              label={<span style={labelCenterStyle}>아이디</span>}
              name="username"
              rules={[{ required: true, message: "아이디를 입력해주세요!" }]}
              style={{ marginBottom: 16 }}
            >
              <Input size="large" style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item
              label={<span style={labelCenterStyle}>비밀번호</span>}
              name="password"
              rules={[{ required: true, message: "비밀번호를 입력해주세요!" }]}
              style={{ marginBottom: 16 }}
            >
              <Input.Password size="large" style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item
              label={<span style={labelCenterStyle}>이메일</span>}
              name="email"
              rules={[
                { required: true, message: "이메일을 입력해주세요!" },
                { type: "email", message: "유효한 이메일 주소를 입력해주세요!" }
              ]}
              style={{ marginBottom: 16 }}
            >
              <Input size="large" style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item
              label={<span style={labelCenterStyle}>비밀번호 확인</span>}
              name="confirmPassword"
              dependencies={["password"]}
              hasFeedback
              rules={[
                { required: true, message: "비밀번호를 다시 입력해주세요!" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error("비밀번호가 일치하지 않습니다!"));
                  },
                }),
              ]}
              style={{ marginBottom: 16 }}
            >
              <Input.Password size="large" style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item
              label={<span style={labelCenterStyle}>이름</span>}
              name="name"
              rules={[{ required: true, message: "이름을 입력해주세요!" }]}
              style={{ marginBottom: 16 }}
            >
              <Input size="large" style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item
              label={<span style={labelCenterStyle}>휴대폰 번호</span>}
              name="phoneNumber"
              rules={[{ required: true, message: "휴대폰 번호를 입력해주세요!" }]}
              style={{ marginBottom: 16 }}
            >
              <Input size="large" style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item wrapperCol={{ span: 24 }}>
              <Button type="primary" htmlType="submit" size="large" style={{ width: "100%" }}>
                회원가입
              </Button>
            </Form.Item>
            <Text type="secondary" style={{ display: "block", textAlign: "center", marginTop: 10 }}>
              이미 계정이 있으신가요?{" "}
              <Button type="link" onClick={() => setModalMode("login")} style={{ padding: 0, height: "auto" }}>
                로그인
              </Button>
            </Text>
          </Form>
        )}
      </Modal>
    </header>
  );
}