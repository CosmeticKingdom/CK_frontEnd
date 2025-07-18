import React from "react";
import { Form, Input, Select, Button, message } from "antd";
import Container from "../components/Container";

const INQUIRY_TYPES = [
  { label: "예약 관련", value: "예약 관련" },
  { label: "서비스 문의", value: "서비스 문의" },
  { label: "기타", value: "기타" },
];

export default function Inquiry() {
  const [form] = Form.useForm();

  const onFinish = (values) => {
    message.success("문의가 성공적으로 접수되었습니다!");
    form.resetFields();
  };

  return (
    <Container>
      <h2 style={{ textAlign: "center", marginBottom: 24 }}>1:1 문의하기</h2>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{ inquiryType: undefined }}
        style={{ maxWidth: 500, margin: "0 auto" }}
      >
        <Form.Item
          name="inquiryType"
          label="문의 유형"
          rules={[{ required: true, message: "문의 유형을 선택해주세요." }]}
        >
          <Select placeholder="문의 유형 선택" options={INQUIRY_TYPES} />
        </Form.Item>
        <Form.Item
          name="name"
          label="이름"
          rules={[{ required: true, message: "이름을 입력해주세요." }]}
        >
          <Input placeholder="이름" />
        </Form.Item>
        <Form.Item
          name="phone"
          label="연락처"
          rules={[{ required: true, message: "연락처를 입력해주세요." }]}
        >
          <Input placeholder="연락처" />
        </Form.Item>
        <Form.Item
          name="email"
          label="이메일"
          rules={[
            { required: true, message: "이메일을 입력해주세요." },
            { type: "email", message: "올바른 이메일 형식을 입력하세요." }
          ]}
        >
          <Input placeholder="이메일" />
        </Form.Item>
        <Form.Item
          name="content"
          label="문의 내용"
          rules={[{ required: true, message: "문의 내용을 입력해주세요." }]}
        >
          <Input.TextArea rows={5} placeholder="문의하실 내용을 입력해주세요." />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" block size="large">
            문의 접수
          </Button>
        </Form.Item>
      </Form>
    </Container>
  );
}