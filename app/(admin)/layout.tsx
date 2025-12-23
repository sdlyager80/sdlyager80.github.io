import { AdminHeader } from "@/components/layouts/admin-header";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-bloom-paleAqua">
      <AdminHeader />
      <main className="flex-1 container mx-auto py-8 px-4">
        {children}
      </main>
    </div>
  );
}
