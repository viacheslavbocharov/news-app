export function AdSlot({ slotId, title = "Advertisement" }: { slotId: string; title?: string }) {
  return (
    <iframe id={slotId} title={`${title}: ${slotId}`} />
  );
}
