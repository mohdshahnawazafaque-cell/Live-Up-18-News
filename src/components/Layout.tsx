import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import BreakingNews from "./BreakingNews";
import Chatbot from "./Chatbot";

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      <Header />
      <BreakingNews />
      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Outlet />
      </main>
      <Footer />
      <Chatbot />
    </div>
  );
}
