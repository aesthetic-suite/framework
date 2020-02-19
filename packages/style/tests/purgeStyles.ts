import { SheetType } from '../src/types';

export default function purgeStyles(type: SheetType) {
  // This is the only way to generate accurate snapshots.
  // It may slow down tests though?
  document.getElementById(`aesthetic-${type}`)!.remove();
}
