import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import * as z from "zod";
import Button from "@/components/Button";
import { useRegister } from "@/features/auth/hooks";

const schema = z.object({
  name: z.string().min(2, "Minimum 2 characters"),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Minimum 6 characters"),
});
type FormData = z.infer<typeof schema>;

export default function Register() {
  const navigate = useNavigate();
  const location = useLocation();
  const redirect = new URLSearchParams(location.search).get("redirect") ?? "/";
  const registerMut = useRegister();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    try {
      await registerMut.mutateAsync(data); // бек поставит cookie, мы инвалидируем ["me"]
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
