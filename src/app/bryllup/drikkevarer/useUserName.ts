import { useLocalStorage } from "usehooks-ts";

const useUserName = () => useLocalStorage<string>("userName", "");

export default useUserName;
