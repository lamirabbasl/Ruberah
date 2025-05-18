import ProfileMenu from "@/components/profile/ProfileMenu";
import ProfileNavbar from "@/components/profile/ProfileNavbar";

export default function Layout({ children }) {
  return (
    <div>
      <ProfileNavbar />
      <ProfileMenu />
      {children}
    </div>
  );
}
