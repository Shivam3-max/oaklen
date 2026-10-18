import { redirect } from "next/navigation";

// The lookbook became the projects page — real delivered homes rather than
// imagined rooms. Old links and any indexed URLs land in the right place.
export default function Lookbook() {
  redirect("/projects");
}
