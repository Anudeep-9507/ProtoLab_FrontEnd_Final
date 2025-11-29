import React from 'react';
import styled from 'styled-components';

const Loader = ({ loading }) => {
  if (!loading) return null;
  return (
    <StyledWrapper>
      <div className="loader" />
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  top: calc(100% - 200px);
  z-index: 3;
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: center;
  width: auto;

  .loader {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .loader::before,
  .loader::after {
    position: absolute;
    content: "";
    height: 8em;
    width: 8em;
    border: 1em solid #0060fa;
    border-radius: 50%;
    animation: loader_79178 1s linear infinite;
  }

  .loader::after {
    opacity: 0;
    animation-delay:0.5s;
  }

  @keyframes loader_79178 {
    0% {
      border: 1em solid #5bed9aff;
      transform: scale(0);
      opacity: 1;
    }

    100% {
      border: 0 solid #0060fa;
      transform: scale(1);
      opacity: 0;
    }
  }`;

export default Loader;
