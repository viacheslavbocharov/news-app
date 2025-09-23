import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "@/components/Button";
import { useRegister } from "@/features/auth/hooks/useRegister";
import { registerSchema, type RegisterForm } from "@/features/auth/schemas/register";

export default function Register() {
  const navigate = useNavigate();
  const location = useLocation();
  const redirect = new URLSearchParams(location.search).get("redirect") ?? "/";
  const registerMut = useRegister();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>({ resolver: zodResolver(registerSchema) });

  const onSubmit = async (data: RegisterForm) => {
    try {
      await registerMut.mutateAsync(data);
      navigate(redirect);
    } catch (e) {
      console.error("Registration error:", e);
    }
  };

  return (
    <div className="mx-auto max-w-md p-6">
      <h1 className="mb-4 text-2xl font-bold">Sign Up</h1>

      {registerMut.isError && (
        <p className="mb-3 text-sm text-red-600">
          {(registerMut.error as Error)?.message ?? "Registration failed"}
        </p>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input
          type="text"
          placeholder="Name"
          {...register("name")}
          className="w-full rounded border px-3 py-2"
        />
        {errors.name && <p className="text-sm text-red-600">{errors.name.message}</p>}

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

        <Button type="submit" disabled={isSubmitting || registerMut.isPending} className="w-full">
          {isSubmitting || registerMut.isPending ? "Creating..." : "Sign Up"}
        </Button>
      </form>
    </div>
  );
}
