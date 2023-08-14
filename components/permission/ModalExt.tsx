import React from "react";
import Modal from "../commons/Modal";

export default function ModalExt({
  children,
  header,
  ths,
  caption,
  actions,
  onCloseModal,
}: {
  children: React.ReactNode;
  header: string;
  ths: string[];
  caption: JSX.Element;
  actions: JSX.Element[];
  onCloseModal: React.MouseEventHandler<HTMLButtonElement>;
}) {
  return (
    <Modal header={header} actions={actions} onCloseModal={onCloseModal}>
      <>
        <table className="w-full border-collapse items-center bg-transparent">
          <thead>
            <tr>
              {ths.map((th) => (
                <th
                  key={th}
                  className="whitespace-nowrap border border-l-0 border-r-0 border-solid border-slate-100 bg-slate-50 px-6 py-3 text-left align-middle text-xs font-semibold text-slate-500"
                >
                  {th}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>{children}</tbody>
        </table>
        {caption}
      </>
    </Modal>
  );
}
