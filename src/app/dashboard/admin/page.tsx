import { Card, CardBody, CardHeader } from "@/components/ui/card";

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">Manage Doctors</h2>
        </CardHeader>
        <CardBody>
          <p className="text-gray-500">
            Doctor management will be available here.
          </p>
        </CardBody>
      </Card>
    </div>
  );
}
