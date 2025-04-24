import {Toaster} from "@/components/ui/toaster";
import {Toaster as Sonner} from "@/components/ui/sonner";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Providers from "./Providers";
import {ModalManager} from "./components/interaction/ModalManager";
import Layout from "./Layout";
import DukiInAction from "@/pages/duki_in_action/DukiInAction";
import {Globals} from "@react-spring/shared";
import {routes} from "@/utils/constants";
import DiviScreen from "@/pages/divi/DiviScreen";
import React, {useState} from "react";
import Will from "@/pages/will/Will";
import {IChingProofSystem} from "./pages/iChing/IChingProofSystem";
import BgmPlayer from "./components/BgmPlayer";

Globals.assign({
  frameLoop: "always",
});

const App = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <Providers>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path={routes.home} element={<Layout />}>
            <Route index element={<Will />} />
            <Route path={routes.dao} element={<DukiInAction />} />
            <Route path={routes.iChing} element={<IChingProofSystem />} />
          </Route>
          <Route path={routes.divi} element={<DiviScreen />} />
        </Routes>
        <BgmPlayer />
      </BrowserRouter>
      <ModalManager />
    </Providers>
  );
};

export default App;