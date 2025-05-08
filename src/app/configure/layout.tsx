import Steps from '@/components/Steps';
import Wrapper from '@/components/Wrapper';

function layout({ children }: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Wrapper className="flex-1 flex flex-col">
      <Steps />
      {children}
    </Wrapper>
  );
}
export default layout;
