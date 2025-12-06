'use client';

import { JSX, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface DashboardLayoutProps {
    children: React.ReactNode;
}

/**
 * Dashboard layout with a collapsible drawer/sidebar
 */
export default function DashboardLayout(props: DashboardLayoutProps): JSX.Element {
    const { children } = props;

    const [isDrawerOpen, setIsDrawerOpen] = useState(true);
    const pathname = usePathname();

    const menuItems = [
        { name: 'Resources', path: '/dashboard/resources', icon: '📦' },
        { name: 'Items', path: '/dashboard/items', icon: '📋' },
        { name: 'Stops', path: '/dashboard/stops', icon: '🛑' },
    ];

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Drawer / Sidebar */}
            <aside
                className={`${
                    isDrawerOpen ? 'w-64' : 'w-20'
                } bg-primary bg-[image:url('/assets/png/effect.png')] border-r border-gray-200 transition-all duration-300 flex flex-col my-3 rounded-tr-lg rounded-br-lg overflow-hidden`}
            >
                {/* Logo and App Name */}
                <div className="h-20 flex items-center justify-center border-b border-[#32323216] mx-2">
                    <Image
                        src="/icons/usermes.svg"
                        alt="Usermes logo"
                        width={40}
                        height={40}
                        priority
                    />
                    {isDrawerOpen && (
                        <span className="ml-3 text-xl font-bold text-gray-800">Usermes</span>
                    )}
                </div>

                {/* Menu Items */}
                <nav className="flex-1 py-6">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                href={item.path}
                                className={`flex items-center px-6 py-3 mx-2 rounded-lg transition-colors ${isActive
                                        ? 'bg-yellow-400 text-gray-800'
                                        : 'text-gray-600 hover:bg-gray-100'
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
                            <span className="text-xl">{isDrawerOpen ? '◀' : '▶'}</span>
                            {isDrawerOpen && <span className="ml-2 text-sm">Collapse</span>}
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto">
                {/* Header */}
                <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-6">
                    <h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1>

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
                <div className="p-6">
                    {children}
                </div>
            </main>
        </div>
    );
}
