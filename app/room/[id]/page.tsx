import { RoomShell } from "@/components/room/room-shell";
import { Id } from "@/convex/_generated/dataModel";

export const metadata = { title: "Room · dispochat" };

export default async function RoomPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <RoomShell roomId={id as Id<"rooms">} />;
}
