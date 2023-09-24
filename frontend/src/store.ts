import { proxy, useSnapshot } from "valtio";

type Status = "pending" | "completed";
type Filter = Status | "all";
type Todo = {
  description: string;
  status: Status;
  id: number;
};

export const store = proxy({
  modal: "all",
});
