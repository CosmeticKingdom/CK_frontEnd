import React, { useState, useEffect } from "react";
import { Form, Input, Button, Typography, message } from "antd";
import Container from "../components/Container";
import axios from "axios";

const { Title } = Typography;

export default function UserProfile() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [userLoginId, setUserLoginId] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          message.error("로그인이 필요합니다.");
          setLoading(false);
          return;
        }
        const response = await axios.get("/user/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        form.setFieldsValue(response.data);
        setUserLoginId(response.data.loginId);
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
        message.error("사용자 정보를 불러오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };
    fetchUserProfile();
  }, [form]);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        message.error("로그인이 필요합니다.");
        setLoading(false);
        return;
      }
      const updateData = { ...values, loginId: userLoginId };
      await axios.put("/user/profile", updateData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      message.success("프로필이 성공적으로 업데이트되었습니다.");
    } catch (error) {
      console.error("Failed to update user profile:", error);
      message.error("프로필 업데이트에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <div style={{ padding: "64px 0" }}>
        <Title level={2} style={{ textAlign: "center", marginBottom: 40 }}>내 정보</Title>
        <Form
          form={form}
          name="userProfile"
          onFinish={onFinish}
          layout="vertical"
          style={{ maxWidth: 600, margin: "0 auto" }}
        >
          
          <Form.Item
            label="이름"
            name="name"
            rules={[{ required: true, message: "이름을 입력해주세요!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="이메일"
            name="email"
            rules={[{ required: true, message: "이메일을 입력해주세요!" }, { type: "email", message: "유효한 이메일 주소를 입력해주세요!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="휴대폰 번호"
            name="phoneNumber"
            rules={[{ required: true, message: "휴대폰 번호를 입력해주세요!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} style={{ width: "100%" }}>
              정보 업데이트
            </Button>
          </Form.Item>
        </Form>
      </div>
    </Container>
  );
}