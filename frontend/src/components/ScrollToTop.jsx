import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

// Hash anchors that now have their own dedicated pages
const HASH_PAGE_REDIRECTS = {
  "#activities": "/activities",
};

export default function ScrollToTop() {
  const { pathname, hash } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const redirect = HASH_PAGE_REDIRECTS[hash];
    if (redirect) {
      navigate(redirect, { replace: true });
      return;
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);

  return null;
}
