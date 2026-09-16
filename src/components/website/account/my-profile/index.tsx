import UserAddressCard from "@/components/website/account/my-profile/UserAddressCard";
import UserDangerZoneCard from "@/components/website/account/my-profile/UserDangerZoneCard";
import UserImageCard from "@/components/website/account/my-profile/UserImageCard";
import UserInfoCard from "@/components/website/account/my-profile/UserInfoCard";
import UserMetaCard from "@/components/website/account/my-profile/UserMetaCard";

export default function MyProfile() {
  return (
    <div>
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/3 lg:p-6">
        <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
          Profile
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <UserMetaCard />
            <UserInfoCard />
            <UserAddressCard />
            <UserDangerZoneCard />
          </div>
          <div className="space-y-6">
            <UserImageCard />
          </div>
        </div>
      </div>
    </div>
  );
}
