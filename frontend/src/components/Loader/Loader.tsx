import styled, { keyframes } from "styled-components";

const key = keyframes`
    0% {
      background-position: 0 calc(-2 * 100% / 4), 0 calc(-2 * 100% / 4),
        0 calc(-2 * 100% / 4), 0 calc(-2 * 100% / 4), 0 calc(-2 * 100% / 4);
    }
    20% {
      background-position: 0 calc(4 * 100% / 4), 0 calc(-2 * 100% / 4),
        0 calc(-2 * 100% / 4), 0 calc(-2 * 100% / 4), 0 calc(-2 * 100% / 4);
    }
    40% {
      background-position: 0 calc(4 * 100% / 4), 0 calc(3 * 100% / 4),
        0 calc(-2 * 100% / 4), 0 calc(-2 * 100% / 4), 0 calc(-2 * 100% / 4);
    }
    60% {
      background-position: 0 calc(4 * 100% / 4), 0 calc(3 * 100% / 4),
        0 calc(2 * 100% / 4), 0 calc(-2 * 100% / 4), 0 calc(-2 * 100% / 4);
    }
    80% {
      background-position: 0 calc(4 * 100% / 4), 0 calc(3 * 100% / 4),
        0 calc(2 * 100% / 4), 0 calc(1 * 100% / 4), 0 calc(-2 * 100% / 4);
    }
    100% {
      background-position: 0 calc(4 * 100% / 4), 0 calc(3 * 100% / 4),
        0 calc(2 * 100% / 4), 0 calc(1 * 100% / 4), 0 calc(0 * 100% / 4);
    }
`;

const Loader = styled.div`
  .loader {
    width: 80px;
    aspect-ratio: 1.154;
    clip-path: polygon(50% 0, 100% 100%, 0 100%);
    --c: no-repeat linear-gradient(#48bb78 0 0);
    background: var(--c), var(--c), var(--c), var(--c), var(--c);
    background-size: 100% calc(100% / 5 + 1px);
    animation: ${key} 2s infinite;
  }
`;

interface IReactLoaderProps {
  onLoad?: (action: any) => any;
}

const ReactLoader: React.FC<IReactLoaderProps> = () => {
  return (
    <Loader >
      <div className="loader bg-green-500" />
    </Loader>
  );
};

export default ReactLoader;
