import {
  CreateOrganization,
  OrganizationSwitcher,
  UserButton,
} from "@clerk/nextjs";
import { useState } from "react";

const Page = () => {
  return (
    <div>
      <div className="flex w-full justify-end px-4 py-2">
        <OrganizationSwitcher afterSwitchOrganizationUrl="/" hidePersonal />
        <UserButton></UserButton>
      </div>
      <div className="flex h-screen w-full items-center justify-center px-2  md:px-4 ">
        <CreateOrganization />
      </div>
    </div>
  );
};
export default Page;
