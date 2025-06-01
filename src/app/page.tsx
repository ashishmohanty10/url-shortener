import { Signup } from "@/components/auth/signup-form";
import { Container } from "@/components/common/container";

export default function Home() {
  return (
    <Container className="flex h-screen w-full items-center justify-center">
      <Signup />
    </Container>
  );
}
