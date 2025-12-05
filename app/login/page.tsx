'use client';

import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

interface BackendConfig {
  domain: string;
  companyName: string;
}

function decodeConfig(encodedConfig: string): BackendConfig | null {
  try {
    // Decode URL-safe base64
    const base64 = encodedConfig.replace(/-/g, '+').replace(/_/g, '/');
    const jsonString = atob(base64);
    return JSON.parse(jsonString);
  } catch (error) {
    console.error('Failed to decode config:', error);
    return null;
  }
}

export default function LoginPage() {
  const searchParams = useSearchParams();
  const [config, setConfig] = useState<BackendConfig | null>(null);

  useEffect(() => {
    const configParam = searchParams.get('config');
    if (configParam) {
      const decoded = decodeConfig(configParam);
      setConfig(decoded);
    }
  }, [searchParams]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <div className="w-full max-w-md">
        <div className="bg-primary rounded-2xl shadow-xl p-4">
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
          <form className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-800 mb-2">
                Username
              </label>
              <input
                id="username"
                type="text"
                className="w-full px-4 py-3 rounded-lg border border-yellow-500 bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:border-transparent"
                placeholder="Enter your username"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-800 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                className="w-full px-4 py-3 rounded-lg border border-yellow-500 bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:border-transparent"
                placeholder="Enter your password"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gray-800 text-white py-3 rounded-lg font-semibold hover:bg-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-700 focus:ring-offset-2 focus:ring-offset-yellow-400"
            >
              Sign In
            </button>
          </form>

          {/* Debug info - remove in production */}
          {config && (
            <div className="mt-4 p-3 bg-white/50 rounded-lg text-xs">
              <p className="font-semibold text-gray-700">Backend Config:</p>
              <p className="text-gray-600">Domain: {config.domain}</p>
              <p className="text-gray-600">Company: {config.companyName}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
