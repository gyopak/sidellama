export interface SyntheticEvent {
  stopPropagation: () => void;
  preventDefault: () => void;
  target: EventTarget;
}
