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

  const [user] = await getUserById(session.user.id);
  return {
    customInstructions: user?.customInstructions || "",
    useLocation: user?.useLocation ?? true,
  };
}
