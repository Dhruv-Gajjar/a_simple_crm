import SignupForm from "@/components/SignupForm";
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

export default function SignUp() {
  return (
    <div className="w-full min-w-lg flex items-center justify-center">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Sign Up Form</CardTitle>
          <CardDescription>
            Fill this form to create an account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SignupForm />
        </CardContent>
        <CardFooter>
          <Link href={"/auth/sign-in"}>
            <p className="text-sm font-light min-w-50 tracking-tight">
              Already have an account?{" "}
              <span className="text-blue-600">Sign in.</span>
            </p>
          </Link>
          <Field
            orientation="horizontal"
            className="flex items-center justify-end"
          >
            <Button className="w-30" type="submit" form={"form-sign-up"}>
              Sign up
            </Button>
          </Field>
        </CardFooter>
      </Card>
    </div>
  );
}
