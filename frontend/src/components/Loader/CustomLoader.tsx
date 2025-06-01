import styled, { keyframes } from "styled-components";

const animation1 = keyframes`
   0%,
    100% {
      width: 65px;
      height: 65px;
    }
    35%,
    65% {
      width: 85px;
      height: 85px;
    }
`;

const animation2 = keyframes`
  0%,
    40% {
      background-position: 0 0, 0 50%, 0 100%, 50% 100%, 100% 100%, 100% 50%,
        100% 0, 50% 0, 50% 50%;
    }
    60%,
    100% {
      background-position: 0 50%, 0 100%, 50% 100%, 100% 100%, 100% 50%, 100% 0,
        50% 0, 0 0, 50% 50%;
    }
`;

const HomeLoader = styled.div`
  .loader {
    --c: no-repeat linear-gradient(#48bb78 0 0);
    background: var(--c), var(--c), var(--c), var(--c), var(--c), var(--c),
      var(--c), var(--c), var(--c);
    background-size: 16px 16px;
    animation: ${animation1} 1s infinite, ${animation2} 1s infinite;
  }
`;

interface IReactLoaderProps {
  onLoad?: (action: any) => any;
}

const CustomLoader: React.FC<IReactLoaderProps> = () => {
  return (
    <HomeLoader>
      <div className="loader bg-green-500" />
    </HomeLoader>
  );
};

export default CustomLoader;
