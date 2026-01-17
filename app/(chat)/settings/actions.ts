"use server";

import { auth } from "@/app/(auth)/auth";
import { getUserById, updateUserById } from "@/lib/db/queries";
import { revalidatePath } from "next/cache";

export async function updateUserSettings(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  try {
    const customInstructions = formData.get("customInstructions") as string;
    const useLocation = formData.get("useLocation") === "on";

    await updateUserById(session.user.id, {
      customInstructions,
      useLocation,
    });

    revalidatePath("/settings");
    
    // Return success - Next.js will handle the redirect
    return { success: true };
  } catch (error) {
    console.error("Failed to update settings:", error);
    return { success: false, error: "Failed to save settings" };
  }
}

export async function getUserSettings() {
  const session = await auth();
  if (!session?.user?.id) {
    return {
      customInstructions: "",
      useLocation: true,
    };
  }

  try {
    const users = await getUserById(session.user.id);
    const user = users[0];

    return {
      customInstructions: user?.customInstructions || "",
      useLocation: user?.useLocation ?? true,
    };
  } catch (error) {
    console.error("Failed to fetch settings from DB:", error);
    return {
      customInstructions: "",
      useLocation: true,
    };
  }
}
