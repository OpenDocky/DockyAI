import { auth } from "@/app/(auth)/auth";
import { redirect } from "next/navigation";
import { getUserSettings, updateUserSettings } from "./actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/");
  }

  return (
    <div className="container max-w-2xl py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          AI personality and privacy settings
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>⚙️ Feature Deploying...</CardTitle>
          <CardDescription>
            The settings feature is currently being deployed to the database.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm">
            This page will be available in a few minutes once the database migration completes.
            In the meantime, the AI is using default settings (French location enabled).
          </p>
          <Button asChild variant="outline">
            <a href="/">Back to Chat</a>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
