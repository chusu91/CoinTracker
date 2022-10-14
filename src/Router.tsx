import { BrowserRouter, Routes, Route } from "react-router-dom";
import Coin from "./routes/Coin";
import Coins from "./routes/Coins";

interface IRouterProps {
  isDark: boolean;
  toggleDark: () => void;
}

function Router({ isDark, toggleDark }: IRouterProps) {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/:coinId/*" element={<Coin isDark={isDark} />}></Route>
        <Route path="/" element={<Coins toggleDark={toggleDark} />}></Route>
      </Routes>
    </BrowserRouter>
  );
}
export default Router;
