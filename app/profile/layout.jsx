import ProfileMenu from "@/components/profile/ProfileMenu";
import ProfileNavbar from "@/components/profile/ProfileNavbar";

export default function Layout({ children }) {
  return (
    <div className="bg-gray-200">
      <ProfileNavbar />
      <ProfileMenu />
      {children}
    </div>
  );
}
