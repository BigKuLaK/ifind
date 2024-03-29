import Header from "components/Header";
import Footer from "components/Footer";
import NewsLetter from "components/NewsLetter";

export default function Layout({ children }: LayoutProps) {
  return (
    <>
      <Header />
      <main id="root">
        {children}
        <NewsLetter />
      </main>
      <Footer />
    </>
  );
}
