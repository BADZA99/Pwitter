
import { atom } from "recoil";

export const modalState = atom({
  key: "textState", // unique ID (with respect to other atoms/selectors)
  default: false, // valeur par défaut (alias valeur initials)
});

export const postIdState = atom({
  key: "postIdState", // unique ID (with respect to other atoms/selectors)
  default: "id", // valeur par défaut (alias valeur initials)
});
