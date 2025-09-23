import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
// import * as z from "zod";
import Button from "@/components/Button";
import { useLogin } from "@/features/auth/hooks/useLogin";
import { loginSchema, type LoginForm } from "@/features/auth/schemas/login";

// const schema = z.object({
//   email: z.string().email("Enter a valid email"),
//   password: z.string().min(6, "Minimum 6 characters"),
// });
// type LoginForm = z.infer<typeof schema>;

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const redirect = new URLSearchParams(location.search).get("redirect") ?? "/";

  const login = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data: LoginForm) => {
    try {
      await login.mutateAsync({ email: data.email, password: data.password });
      navigate(redirect);
    } catch (e) {
      console.error("Login error:", e);
    }
  };

  return (
    <div className="mx-auto max-w-md p-6">
      <h1 className="mb-4 text-2xl font-bold">Log In</h1>

      {login.isError && (
        <p className="mb-3 text-sm text-red-600">
          {(login.error as Error)?.message ?? "Login failed"}
        </p>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          {...register("email")}
          className="w-full rounded border px-3 py-2"
        />
        {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}

        <input
          type="password"
          placeholder="Password"
          {...register("password")}
          className="w-full rounded border px-3 py-2"
        />
        {errors.password && <p className="text-sm text-red-600">{errors.password.message}</p>}

        <Button type="submit" disabled={isSubmitting || login.isPending} className="w-full">
          {isSubmitting || login.isPending ? "Loging in..." : "Log In"}
        </Button>
      </form>

      <p className="mt-4 text-sm text-gray-600">
        Don’t have an account?{" "}
        <Link
          to={`/register?redirect=${encodeURIComponent(redirect)}`}
          className="text-blue-600 hover:underline"
        >
          Sign Up
        </Link>
      </p>
    </div>
  );
}
