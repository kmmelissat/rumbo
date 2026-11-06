import { redirect } from "next/navigation";

/** La presentación vive en "/"; esta ruta se conserva por compatibilidad. */
export default function Page() {
  redirect("/");
}
