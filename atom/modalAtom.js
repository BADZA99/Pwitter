
import { atom } from "recoil";

export const modalState = atom({
  key: "textState", // unique ID (with respect to other atoms/selectors)
  default: false, // valeur par défaut (alias valeur initials)
});
