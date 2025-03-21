import { ReactNode } from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/authOptions';

export const metadata: Metadata = {
    title: 'Admin Dashboard | OWASP Cebu',
    description: 'OWASP Cebu - Admin Dashboard',
};

const AdminLayout = async ({ children }: { children: ReactNode }) => {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ADMIN') {
        redirect('/');
    }
    return (
        <div className="flex h-screen bg-gray-950">
            {/* Sidebar */}
            <div className="w-64 bg-gray-900 border-r border-gray-800">
                <div className="flex items-center justify-center h-16 px-4 border-b border-gray-800">
                    <h1 className="text-xl font-bold text-white">OWASP Cebu Admin</h1>
                </div>
                <nav className="mt-5">
                    <ul className="space-y-2 px-2">
                        <li>
                            <Link
                                href="/admin"
                                className="flex items-center px-4 py-2 text-gray-300 hover:bg-gray-800 rounded-md"
                            >
                                <span>Dashboard</span>
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/admin/ctfs"
                                className="flex items-center px-4 py-2 text-gray-300 hover:bg-gray-800 rounded-md"
                            >
                                <span>CTF Challenges</span>
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/admin/promote"
                                className="flex items-center px-4 py-2 text-gray-300 hover:bg-gray-800 rounded-md"
                            >
                                <span>Promote User</span>
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/"
                                className="flex items-center px-4 py-2 text-gray-300 hover:bg-gray-800 rounded-md"
                            >
                                <span>Back to Website</span>
                            </Link>
                        </li>
                    </ul>
                </nav>
            </div>

            {/* Main content */}
            <div className="flex-1 overflow-auto">
                <header className="h-16 border-b border-gray-800 bg-gray-900 flex items-center px-6">
                    <h2 className="text-xl font-semibold text-white">Admin Dashboard</h2>
                </header>
                <main className="p-6">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default AdminLayout; 