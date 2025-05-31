import { Signin } from "@/components/auth/signin";
import { Container } from "@/components/common/container";

export default function Home() {
  return (
    <Container className="h-screen flex items-center justify-center w-full">
      <Signin />
    </Container>
  );
}
