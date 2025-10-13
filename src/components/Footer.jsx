import { useEffect, useState } from "react";

export default function Footer() {
  const [footerItems, setFooterItems] = useState({ service: [], company: [], social: [] });
  const [loading, setLoading] = useState(true);

  const fetchFooter = async () => {
    try {
      const res = await fetch("http://localhost/college_api/get_footer_items.php", {
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        const grouped = { service: [], company: [], social: [] };
        data.items.forEach((item) => {
          if (item.type && grouped[item.type]) grouped[item.type].push(item);
        });
        setFooterItems(grouped);
      } else {
        setFooterItems({ service: [], company: [], social: [] });
      }
    } catch (err) {
      console.error(err);
      setFooterItems({ service: [], company: [], social: [] });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFooter();
  }, []);

  if (loading) return <p>Loading Footer...</p>;

  // Helper to parse SVG string to JSX
  const renderSVG = (svgString) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(svgString, "image/svg+xml");
    const svgEl = doc.querySelector("svg");
    if (!svgEl) return null;
    // Convert outerHTML to JSX
    return <span dangerouslySetInnerHTML={{ __html: svgEl.outerHTML }} />;
  };

  return (
    <footer className="footer sm:footer-horizontal bg-base-300 text-base-content px-10 py-24">
      {/* Services */}
      <nav>
        <h6 className="footer-title">Services</h6>
        {footerItems.service.map((item) => (
          <a key={item.id} href={item.link} className="link link-hover">
            {item.name}
          </a>
        ))}
      </nav>

      {/* Company */}
      <nav>
        <h6 className="footer-title">Company</h6>
        {footerItems.company.map((item) => (
          <a key={item.id} href={item.link} className="link link-hover">
            {item.name}
          </a>
        ))}
      </nav>

      {/* Social */}
      <nav>
        <h6 className="footer-title">Social</h6>
        <div className="grid grid-flow-col gap-4">
          {footerItems.social.map((item) => (
            <a
              key={item.id}
              href={item.link}
              className="flex flex-col items-center justify-center gap-1"
            >
              {renderSVG(item.icon_svg)}
              <span>{item.name}</span>
            </a>
          ))}
        </div>
      </nav>
    </footer>
  );
}
