import styled from "styled-components";

const Button = styled.button`
  width: 50px;
  height: 50px;
  text-align: center;
  font-weight: 500;
  border-radius: 25px;
  outline: none;
  border: none;
  background-color: ${(props) => props.theme.buttonBgColor};
  color: ${(props) => props.theme.buttonColor};
  cursor: pointer;
  transition: all linear 300ms;
  :hover {
    transform: scale(1.1);
  }
`;

export default Button;
