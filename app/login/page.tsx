"use client";

import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { decodeConfig, type BackendConfig } from "@/utils/backend-config";
import {
  saveConfigToken,
  getConfigToken,
  saveAuthToken,
  apiClient,
} from "@/utils/api-client";

function LoginForm() {
  const searchParams = useSearchParams();
  const [config, setConfig] = useState<BackendConfig | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    // Check if config exists in localStorage first
    const storedToken = getConfigToken();

    // Get config from URL param
    const configParam = searchParams.get("config");

    if (configParam) {
      // Save to localStorage for future requests
      saveConfigToken(configParam);
      const decoded = decodeConfig(configParam);
      setConfig(decoded);
    } else if (storedToken) {
      // Load from localStorage if not in URL
      const decoded = decodeConfig(storedToken);
      setConfig(decoded);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

    try {
      // Call API route with x-config header (automatically added by apiClient)
      const response = await apiClient("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ username, password }),
      });

      const result = await response.json();

      if (result.success) {
        // Store token and go to location selection
        saveAuthToken(result.token || "");
        window.location.href = "/location";
      } else {
        setError(result.error || "Login failed");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred",
      );
      console.error("Login error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <div className="w-full max-w-md">
        <div className="bg-primary bg-[image:url('/assets/png/effect.png')] rounded-2xl shadow-xl p-4">
          {/* Header with Logo and Name */}
          <div className="flex flex-row items-center justify-center gap-4 h-20 border-b-2 border-[#00000016] mb-6">
            <Image
              src="/icons/usermes.svg"
              alt="Usermes logo"
              width={45}
              height={45}
              priority
            />
            <h1 className="text-3xl font-bold text-gray-800 uppercase">
              Usermes
            </h1>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-800 mb-2"
              >
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                disabled={isLoading}
                className="w-full px-4 py-3 rounded-lg border border-yellow-500 bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:border-transparent disabled:opacity-50"
                placeholder="Enter your username"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-800 mb-2"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                disabled={isLoading}
                className="w-full px-4 py-3 rounded-lg border border-yellow-500 bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:border-transparent disabled:opacity-50"
                placeholder="Enter your password"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || !config}
              className="w-full bg-gray-800 text-white py-3 rounded-lg font-semibold hover:bg-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-700 focus:ring-offset-2 focus:ring-offset-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          {/* Debug info - remove in production */}
          {config && (
            <div className="mt-4 p-3 bg-white/50 rounded-lg text-xs">
              <p className="font-semibold text-gray-700">Company Info:</p>
              <p className="text-gray-600">Company: {config.companyName}</p>
              <p className="text-gray-600">CNPJ: {config.cnpj}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-white">
          <div className="text-gray-600">Loading...</div>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
