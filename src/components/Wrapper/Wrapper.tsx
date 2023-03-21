type WrapperProps<T> = {
  children: T;
  if: boolean;
  wrapper: (children: T) => React.ReactNode;
  fallbackWrapper?: (children: T) => React.ReactNode;
};

const Wrapper = <T extends React.ReactNode>({
  children,
  if: condition,
  wrapper,
  fallbackWrapper,
}: WrapperProps<T>) => {
  if (condition) {
    return <>{wrapper(children)}</>;
  }

  if (fallbackWrapper) {
    return <>{fallbackWrapper(children)}</>;
  }

  return <>{children}</>;
};

export default Wrapper;
