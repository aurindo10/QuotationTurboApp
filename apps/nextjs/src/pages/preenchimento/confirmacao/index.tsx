import { CheckCircle } from "@phosphor-icons/react";

export default function Page() {
  return (
    <div className="w-full">
      <div className="flex h-screen flex-col items-center justify-center">
        <label className="text-[30px]">Enviado com sucesso</label>
        <CheckCircle size={50} />
      </div>
    </div>
  );
}
