import React, { ReactHTMLElement, useEffect } from "react";
import * as RadioGroup from "@radix-ui/react-radio-group";
import { useOrganization, useOrganizationList } from "@clerk/nextjs";
import { useRouter } from "next/router";
import { redirect } from "next/navigation";
import { useToastStore } from "../../../../zustandStore/ToastStore";

const RadioGroupDemo = () => {
  const [loading, setLoading] = React.useState("");
  const { setActive, organizationList, isLoaded } = useOrganizationList();
  const [idOrg, setIdOrg] = React.useState<string | undefined>();
  const { organization } = useOrganization();
  const router = useRouter();
  const [setToastOpen, setContent] = useToastStore((state) => [
    state.setOpenOnClique,
    state.setContent,
  ]);
  useEffect(() => {
    if (isLoaded) {
      setIdOrg(organization?.id);
    }
  }, [organization, isLoaded]);
  const handleSubmmit = () => {
    setLoading("loading");
    setActive?.({ organization: idOrg })
      .then(() => {
        setLoading("");
        setToastOpen();
        setContent({
          title: "Empresa alterada com sucesso",
          description: `A empresa foi alterada com sucesso`,
          type: "success",
        });
      })
      .catch((err) => {
        setLoading("");
        console.log(err);
        setToastOpen();
        setContent({
          title: "Erro ao alterar a empresa",
          description: "Houve algum erro ao alterar a empresa",
          type: "error",
        });
      });
  };
  if (!isLoaded) return null;
  return (
    <div>
      <RadioGroup.Root
        className="flex flex-col gap-2.5"
        aria-label="View density"
        value={idOrg}
        onValueChange={(value: string) => {
          setIdOrg(value);
        }}
      >
        {organizationList?.map(({ organization }) => {
          return (
            <div className="flex items-center" key={organization.id}>
              <RadioGroup.Item
                className="shadow-blackA7 hover:bg-violet3 h-[25px] w-[25px] cursor-default rounded-full bg-white shadow-[0_2px_10px] outline-none focus:shadow-[0_0_0_2px] focus:shadow-black"
                value={organization.id}
                id="r1"
              >
                <RadioGroup.Indicator className="after:bg-violet11 relative flex h-full w-full items-center justify-center after:block after:h-[11px] after:w-[11px] after:rounded-[50%] after:content-['']" />
              </RadioGroup.Item>
              <label
                className="pl-[15px] text-[15px] leading-none text-white"
                htmlFor="r1"
              >
                {organization.name}
              </label>
            </div>
          );
        })}
      </RadioGroup.Root>
      <button
        className="btn btn-success mt-4"
        onClick={() => {
          handleSubmmit();
        }}
      >
        <span className={`${loading} loading-spinner`}></span>
        Mudar Empresa
      </button>
    </div>
  );
};

export default RadioGroupDemo;
