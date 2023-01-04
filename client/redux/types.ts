interface ActionType {
  type: string;
  payload?: any;
}
type DispatchType = ({}: ActionType) => void;

export type { ActionType, DispatchType };
