import { auth } from "@/app/(auth)/auth";
import { getUserById, updateUserById } from "@/lib/db/queries";
import { revalidatePath } from "next/cache";

export async function updateUserSettings(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const customInstructions = formData.get("customInstructions") as string;
  const useLocation = formData.get("useLocation") === "on";

  await updateUserById(session.user.id, {
    customInstructions,
    useLocation,
  });

  revalidatePath("/settings");
}

export async function getUserSettings() {
  const session = await auth();
  if (!session?.user?.id) {
    return null;
  }

  try {
    // Retry once if DB is slow during migration
    let users = await getUserById(session.user.id);
    
    if (users.length === 0) {
      console.warn(`User ${session.user.id} not found in DB, retrying once...`);
      await new Promise(r => setTimeout(r, 2000));
      users = await getUserById(session.user.id);
    }

    const user = users[0];
    return {
      customInstructions: user?.customInstructions || "",
      useLocation: user?.useLocation ?? true,
    };
  } catch (error) {
    console.error("Failed to fetch settings from DB:", error);
    // Return default settings instead of crashing
    return {
      customInstructions: "",
      useLocation: true,
    };
  }
}
