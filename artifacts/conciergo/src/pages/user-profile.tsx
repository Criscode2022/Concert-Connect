import { AppLayout } from "@/components/layout/app-layout";
import { useGetUser } from "@workspace/api-client-react";
import { useParams } from "wouter";

export default function UserProfile() {
  const { userId } = useParams<{ userId: string }>();
  
  return (
    <AppLayout title="User Profile" showBack>
      <div className="p-4">
        <h2>User Profile {userId}</h2>
      </div>
    </AppLayout>
  );
}