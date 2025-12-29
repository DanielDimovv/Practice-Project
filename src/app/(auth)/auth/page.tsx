"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useRegister, useLogin } from "@/hooks/useAuth";
import { useAuthContext } from "@/context/AuthContext";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function AuthPage() {
  const { setUser } = useAuthContext();
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const {
    mutate: register,
    isError: isRegisterError,
    error: registerError,
    isPending: isRegisterPending,
  } = useRegister();

  const {
    mutate: login,
    isError: isLoginError,
    error: loginError,
    isPending: isLoginPending,
  } = useLogin();

  return (
    <>
      {isLogin ? (
        <Card className="w-full max-w-md mx-auto p-4 sm:p-6 mt-8 sm:mt-16">
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              login(loginData, {
                onSuccess: (data) => {
                  setUser(data.user);
                  router.push("/dashboard");
                },
              });
            }}
          >
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                type="email"
                value={loginData.email}
                onChange={(e) => {
                  setLoginData({ ...loginData, email: e.target.value });
                }}
              />
            </div>

            <div className="space-y-2">
              <Label>Password</Label>
              <Input
                type="password"
                value={loginData.password}
                onChange={(e) => {
                  setLoginData({ ...loginData, password: e.target.value });
                }}
              />
            </div>

            {isLoginError && (
              <p className="text-red-500">{loginError?.message}</p>
            )}
            <div className="flex gap-2">
              {" "}
              <Button type="submit" disabled={isLoginPending}>
                {isLoginPending ? "Logging in..." : "Log in "}
              </Button>
              <Button
                type="button"
                onClick={() => {
                  setIsLogin(false);
                  setLoginData({ email: "", password: "" });
                }}
              >
                {`Don't have account?`}
              </Button>{" "}
            </div>
          </form>
        </Card>
      ) : (
        <Card className="w-full max-w-md mx-auto p-4 sm:p-6 mt-8 sm:mt-16">
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              register(registerData, {
                onSuccess: (data) => {
                  setUser(data.user);
                  router.push("/dashboard");
                },
              });
            }}
          >
            <div className="space-y-2">
              <Label>Name</Label>
              <Input
                type="text"
                value={registerData.name}
                onChange={(e) => {
                  setRegisterData({ ...registerData, name: e.target.value });
                }}
              />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                type="email"
                value={registerData.email}
                onChange={(e) => {
                  setRegisterData({ ...registerData, email: e.target.value });
                }}
              />
            </div>

            <div className="space-y-2">
              <Label>Password</Label>
              <Input
                type="password"
                value={registerData.password}
                onChange={(e) => {
                  setRegisterData({
                    ...registerData,
                    password: e.target.value,
                  });
                }}
              />
            </div>

            {isRegisterError && (
              <p className="text-red-500">{registerError?.message}</p>
            )}

            <div className="flex gap-2">
              <Button type="submit" disabled={isRegisterPending}>
                {isRegisterPending ? "Registering..." : "Register"}
              </Button>
              <Button
                type="button"
                onClick={() => {
                  setIsLogin(true);
                  setRegisterData({ name: "", email: "", password: "" });
                }}
              >
                I have account
              </Button>
            </div>
          </form>
        </Card>
      )}
    </>
  );
}
