import React, { useRef } from "react";
import { Modal, Input, Button } from "reactstrap";

import styled from "styled-components";
const CustomModal = styled(Modal)`
  top: 20%;
  .modal-content {
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.406);
    padding: 20px;
    input {
      margin: 10px 0 20px 0;
    }
    // input error style
    .error {
      margin-bottom: 10px;
      font-size: 12px;
      color: red;
    }
  }
`;

interface Props {
  isLoading: boolean;
  error: string;
  isOpen: boolean;
  toggle: () => void;
  onSubmit: (username: string) => void;
}

const LoginModal: React.FC<Props> = ({
  isLoading,
  error,
  isOpen,
  toggle,
  onSubmit,
}) => {
  const username = useRef<HTMLInputElement>(null);

  const handleSubmit = () =>
    username?.current?.value && onSubmit(username?.current?.value);

  return (
    <CustomModal isOpen={isOpen} toggle={toggle} backdrop={false}>
      <h5>UserName</h5>
      <Input
        innerRef={username}
        type="text"
        placeholder="Enter User Name"
        disabled={isLoading}
      />
      {error && <span className="error">{error}</span>}
      <Button disabled={isLoading} color="primary" onClick={handleSubmit}>
        {" "}
        Login{" "}
      </Button>
    </CustomModal>
  );
};

export default LoginModal;
