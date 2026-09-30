import SigninForm from "@/components/SigninForm";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import Link from "next/link";

export default function SignIn() {
  return (
    <div className="w-full min-w-lg flex items-center justify-center">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Sign In Form</CardTitle>
          <CardDescription>
            Fill this form to log in to your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SigninForm />
        </CardContent>
        <CardFooter>
          <Link href={"/auth/sign-up"}>
            <p className="text-sm font-light min-w-50 tracking-tight">
              Don&apos;t have an account?{" "}
              <span className="text-blue-600">Sign up.</span>
            </p>
          </Link>
          <Field
            orientation="horizontal"
            className="flex items-center justify-end"
          >
            <Button className="w-30" type="submit" form={"form-sign-in"}>
              Sign in
            </Button>
          </Field>
        </CardFooter>
      </Card>
    </div>
  );
}
