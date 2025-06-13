"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import axios from "axios";
import { useAppData, user_service } from "@/context/AppContext";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { useGoogleLogin } from "@react-oauth/google";
import { redirect } from "next/navigation";
import Loading from "@/components/loading";

const LoginPage = () => {
  const { isAuth, user, setIsAuth, loading, setLoading, setUser } = useAppData();

  if (isAuth) return redirect("/blogs");

  interface LoginResponse {
    message: string;
    token: string;
    user: {
      _id: string;
  name: string;
  email: string;
  image: string;
  instagram: string;
  facebook: string;
  linkedin: string;
  bio: string;
    };
  }

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      const { access_token } = tokenResponse;
      if (!access_token) {
        toast.error("No access token received");
        return;
      }

      setLoading(true);
      try {
        const result = await axios.post<LoginResponse>(`${user_service}/api/v1/login`, {
          access_token,
        });

        Cookies.set("token", result.data.token, {
          expires: 5,
          secure: true,
          path: "/",
        });

        toast.success(result.data.message);
        setIsAuth(true);
        setUser(result.data.user);
      } catch (error) {
        console.error("Login failed:", error);
        toast.error("Problem while logging you in");
      } finally {
        setLoading(false);
      }
    },
    onError: () => toast.error("Google login failed"),
    flow: "implicit", // You might want to switch to "auth-code" for production
  });

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <div className="w-[350px] m-auto mt-[200px]">
          <Card className="w-[350px]">
            <CardHeader>
              <CardTitle>Login to The Reading Retreat</CardTitle>
              <CardDescription>Your go-to blog app</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => googleLogin()}>
                Login with Google
                <img
                  src="/google.png"
                  className="w-6 h-6 ml-2"
                  alt="Google icon"
                />
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};

export default LoginPage;
