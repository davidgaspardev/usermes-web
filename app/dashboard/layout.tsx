"use client";

import { JSX, Suspense, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useSearchParams, useRouter } from "next/navigation";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

function DashboardLayoutInner({ children }: DashboardLayoutProps): JSX.Element {
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const location = searchParams.get("location");

  // Redirect to location selection if no location is specified
  useEffect(() => {
    if (!location) {
      router.push("/location");
    }
  }, [location, router]);

  // Preserve the location param in all nav links
  const withLocation = (path: string) =>
    location ? `${path}?location=${location}` : path;

  const menuItems = [
    { name: "Resources", path: "/dashboard/resources", icon: "📦" },
    { name: "Items", path: "/dashboard/items", icon: "📋" },
    { name: "Stops", path: "/dashboard/stops", icon: "🛑" },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Drawer / Sidebar */}
      <aside
        className={`${
          isDrawerOpen ? "w-64" : "w-20"
        } bg-primary bg-[image:url('/assets/png/effect.png')] border-r border-gray-200 transition-all duration-300 flex flex-col my-3 rounded-tr-lg rounded-br-lg overflow-hidden`}
      >
        {/* Logo and App Name */}
        <div className="h-20 flex items-center justify-center border-b border-[#32323216] mx-2">
          <Link href={withLocation("/dashboard")}>
            <Image
              src="/icons/usermes.svg"
              alt="Usermes logo"
              width={40}
              height={40}
              priority
            />
          </Link>
          {isDrawerOpen && (
            <Link
              href={withLocation("/dashboard")}
              className="ml-3 text-xl font-bold text-gray-800"
            >
              Usermes
            </Link>
          )}
        </div>

        {/* Location badge */}
        {location && isDrawerOpen && (
          <div className="mx-3 mt-3 px-3 py-2 bg-white/60 rounded-lg">
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">
              Location
            </p>
            <p className="font-mono text-sm font-bold text-gray-800 truncate">
              {location}
            </p>
          </div>
        )}

        {/* Menu Items */}
        <nav className="flex-1 py-6">
          {menuItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.path}
                href={withLocation(item.path)}
                className={`flex items-center px-6 py-3 mx-2 rounded-lg transition-colors ${
                  isActive
                    ? "bg-yellow-400 text-gray-800"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <span className="text-2xl">{item.icon}</span>
                {isDrawerOpen && (
                  <span className="ml-3 font-medium">{item.name}</span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Toggle Button */}
        <div className="border-t border-[#32323216] mx-2">
          <div className="p-4">
            <button
              onClick={() => setIsDrawerOpen(!isDrawerOpen)}
              className="w-full flex items-center justify-center py-2 px-4 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <span className="text-xl">{isDrawerOpen ? "◀" : "▶"}</span>
              {isDrawerOpen && <span className="ml-2 text-sm">Collapse</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Header */}
        <header className="h-20 border-b border-gray-200 flex items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1>
            {location && (
              <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full font-mono">
                {location}
              </span>
            )}
          </div>

          {/* User Menu / Actions */}
          <div className="flex items-center gap-4">
            <button className="px-4 py-2 text-gray-600 hover:text-gray-800">
              Notifications
            </button>
            <button className="px-4 py-2 text-gray-600 hover:text-gray-800">
              Profile
            </button>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}

export default function DashboardLayout({
  children,
}: DashboardLayoutProps): JSX.Element {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center bg-gray-100">
          <p className="text-gray-500 text-sm">Loading...</p>
        </div>
      }
    >
      <DashboardLayoutInner>{children}</DashboardLayoutInner>
    </Suspense>
  );
}
